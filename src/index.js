const AlpacaTrader = require('./trader');
const { setTrader } = require('./ui-server');

async function main() {
  console.log('🚀 Starting Paper Trading Bot...');
  
  const trader = new AlpacaTrader();
  setTrader(trader);

  // Start UI server
  require('./ui-server');

  // Check account
  const account = await trader.getAccount();
  console.log(`💰 Paper Account: $${account.equity}`);
  console.log(`📈 Buying Power: $${account.buying_power}`);

  // Main trading loop
  setInterval(async () => {
    if (!trader.canTrade()) {
      console.log(`[${new Date().toLocaleTimeString()}] Waiting... (positions: ${trader.positions.size}, trades today: ${trader.tradesToday})`);
      return;
    }

    console.log(`[${new Date().toLocaleTimeString()}] Scanning for opportunities...`);
    const opportunities = await trader.scanForOpportunities();
    
    if (opportunities.length > 0) {
      const best = opportunities[0];
      console.log(`Found: ${best.symbol} +${(best.priceChange * 100).toFixed(2)}% volume ${best.volumeRatio.toFixed(2)}x`);
      
      if (best.currentPrice >= 5 && best.currentPrice <= 100) {
        await trader.buy(best.symbol, best.currentPrice);
      }
    }
  }, 60000); // Scan every minute

  // Position monitoring
  setInterval(async () => {
    await trader.checkPositions();
  }, 30000); // Check every 30 seconds

  console.log('✅ Trading bot running');
  console.log('📊 View stats at: http://localhost:3456');
}

main().catch(console.error);
