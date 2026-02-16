const Alpaca = require('@alpacahq/alpaca-trade-api');
const config = require('./config');

class AlpacaTrader {
  constructor() {
    this.alpaca = new Alpaca({
      keyId: process.env.ALPACA_API_KEY,
      secretKey: process.env.ALPACA_SECRET_KEY,
      paper: true,
      usePolygon: false
    });
    
    this.positions = new Map();
    this.tradesToday = 0;
    this.lastTradeTime = 0;
    this.dailyStats = {
      date: new Date().toISOString().split('T')[0],
      trades: [],
      profitLoss: 0,
      positionsOpened: 0,
      positionsClosed: 0
    };
  }

  async getAccount() {
    return await this.alpaca.getAccount();
  }

  async getPositions() {
    return await this.alpaca.getPositions();
  }

  async getBars(symbol, timeframe = '15Min', limit = 10) {
    const bars = await this.alpaca.getBarsV2(
      symbol,
      { timeframe, limit, feed: 'iex' }
    );
    return bars;
  }

  async checkMomentum(symbol) {
    try {
      const bars = await this.getBars(symbol, '5Min', 20);
      const barArray = [];
      for await (const bar of bars) {
        barArray.push(bar);
      }
      
      if (barArray.length < 3) return null;
      
      const recent = barArray.slice(-3);
      const priceChange = (recent[2].ClosePrice - recent[0].OpenPrice) / recent[0].OpenPrice;
      
      // Calculate volume average
      const avgVolume = barArray.slice(0, -3).reduce((sum, b) => sum + b.Volume, 0) / (barArray.length - 3);
      const recentVolume = recent.reduce((sum, b) => sum + b.Volume, 0) / 3;
      
      return {
        symbol,
        priceChange,
        volumeRatio: recentVolume / avgVolume,
        currentPrice: recent[2].ClosePrice,
        hasMomentum: priceChange > config.MOMENTUM_THRESHOLD && recentVolume > avgVolume * config.VOLUME_MULTIPLIER
      };
    } catch (e) {
      return null;
    }
  }

  async scanForOpportunities() {
    const opportunities = [];
    
    for (const symbol of config.TICKERS) {
      const momentum = await this.checkMomentum(symbol);
      if (momentum && momentum.hasMomentum) {
        opportunities.push(momentum);
      }
    }
    
    // Sort by momentum strength
    return opportunities.sort((a, b) => b.priceChange - a.priceChange).slice(0, 5);
  }

  canTrade() {
    const now = Date.now();
    const marketOpen = this.isMarketOpen();
    const inQuietPeriod = this.isQuietPeriod();
    const cooledDown = now - this.lastTradeTime > config.MIN_TRADE_INTERVAL;
    const underLimit = this.tradesToday < config.MAX_TRADES_PER_DAY;
    
    return marketOpen && !inQuietPeriod && cooledDown && underLimit && this.positions.size === 0;
  }

  isMarketOpen() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const time = hour * 60 + minute;
    const open = 9 * 60 + 30;
    const close = 16 * 60;
    return time >= open && time <= close;
  }

  isQuietPeriod() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const time = hour * 60 + minute;
    const noTradeStart = 9 * 60 + 30;
    const noTradeEnd = 15 * 60 + 30;
    const marketClose = 16 * 60;
    
    return time < noTradeStart || time > noTradeEnd;
  }

  async buy(symbol, price) {
    try {
      const qty = Math.floor(config.MAX_POSITION_SIZE / price);
      if (qty < 1) return null;

      const order = await this.alpaca.createOrder({
        symbol,
        qty,
        side: 'buy',
        type: 'market',
        time_in_force: 'day'
      });

      this.positions.set(symbol, {
        symbol,
        qty,
        entryPrice: price,
        entryTime: Date.now(),
        maxLoss: config.MAX_LOSS_PER_TRADE,
        targetPrice: price * (1 + config.PROFIT_TARGET)
      });

      this.tradesToday++;
      this.lastTradeTime = Date.now();
      this.dailyStats.positionsOpened++;
      this.dailyStats.trades.push({
        time: new Date().toISOString(),
        action: 'BUY',
        symbol,
        qty,
        price
      });

      console.log(`[BUY] ${qty} shares of ${symbol} @ $${price}`);
      return order;
    } catch (e) {
      console.error(`Buy error for ${symbol}:`, e.message);
      return null;
    }
  }

  async sell(symbol, reason) {
    try {
      const position = this.positions.get(symbol);
      if (!position) return;

      const order = await this.alpaca.createOrder({
        symbol,
        qty: position.qty,
        side: 'sell',
        type: 'market',
        time_in_force: 'day'
      });

      // Get fill price
      const fills = await this.alpaca.getOrder(order.id);
      const exitPrice = parseFloat(fills.filled_avg_price);
      const pnl = (exitPrice - position.entryPrice) * position.qty;

      this.dailyStats.profitLoss += pnl;
      this.dailyStats.positionsClosed++;
      this.dailyStats.trades.push({
        time: new Date().toISOString(),
        action: 'SELL',
        symbol,
        qty: position.qty,
        price: exitPrice,
        pnl,
        reason
      });

      this.positions.delete(symbol);
      console.log(`[SELL] ${position.qty} shares of ${symbol} @ $${exitPrice} | P&L: $${pnl.toFixed(2)} | ${reason}`);
      return order;
    } catch (e) {
      console.error(`Sell error for ${symbol}:`, e.message);
      return null;
    }
  }

  async checkPositions() {
    for (const [symbol, position] of this.positions) {
      try {
        const bars = await this.getBars(symbol, '1Min', 1);
        const barArray = [];
        for await (const bar of bars) {
          barArray.push(bar);
        }
        
        if (barArray.length === 0) continue;
        
        const currentPrice = barArray[0].ClosePrice;
        const unrealizedPnl = (currentPrice - position.entryPrice) * position.qty;
        
        // Check stop loss
        if (unrealizedPnl <= -position.maxLoss) {
          await this.sell(symbol, 'STOP LOSS');
          continue;
        }
        
        // Check profit target
        if (currentPrice >= position.targetPrice) {
          await this.sell(symbol, 'PROFIT TARGET');
          continue;
        }
        
        // Check EOD
        if (config.EOD_CLOSE && !this.isMarketOpen()) {
          await this.sell(symbol, 'EOD CLOSE');
        }
      } catch (e) {
        console.error(`Check position error for ${symbol}:`, e.message);
      }
    }
  }

  getStats() {
    return {
      ...this.dailyStats,
      currentPositions: Array.from(this.positions.values()),
      tradesRemaining: config.MAX_TRADES_PER_DAY - this.tradesToday,
      canTrade: this.canTrade()
    };
  }
}

module.exports = AlpacaTrader;
