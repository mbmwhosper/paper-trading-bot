const express = require('express');
const path = require('path');
const AlpacaTrader = require('./trader');

const app = express();
const PORT = process.env.PORT || process.env.UI_PORT || 3456;

// Store trader instance globally for UI access
let trader = null;

function setTrader(t) {
  trader = t;
}

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.get('/api/account', async (req, res) => {
  if (!trader) return res.status(503).json({ error: 'Trader not initialized' });
  try {
    const account = await trader.getAccount();
    res.json({
      cash: parseFloat(account.cash),
      equity: parseFloat(account.equity),
      buying_power: parseFloat(account.buying_power),
      daytrade_count: account.daytrade_count,
      status: account.status
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/positions', async (req, res) => {
  if (!trader) return res.status(503).json({ error: 'Trader not initialized' });
  try {
    const positions = await trader.getPositions();
    res.json(positions.map(p => ({
      symbol: p.symbol,
      qty: parseInt(p.qty),
      avg_entry_price: parseFloat(p.avg_entry_price),
      current_price: parseFloat(p.current_price),
      market_value: parseFloat(p.market_value),
      unrealized_pl: parseFloat(p.unrealized_pl),
      unrealized_plpc: parseFloat(p.unrealized_plpc)
    })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/stats', (req, res) => {
  if (!trader) return res.status(503).json({ error: 'Trader not initialized' });
  res.json(trader.getStats());
});

app.get('/api/config', (req, res) => {
  const config = require('./config');
  res.json({
    max_position_size: config.MAX_POSITION_SIZE,
    max_loss_per_trade: config.MAX_LOSS_PER_TRADE,
    max_trades_per_day: config.MAX_TRADES_PER_DAY,
    profit_target_pct: config.PROFIT_TARGET * 100
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`📊 Trading UI: http://localhost:${PORT}`);
});

module.exports = { app, setTrader };
