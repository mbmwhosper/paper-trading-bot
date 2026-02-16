const AlpacaTrader = require('./trader');
const fs = require('fs');
const path = require('path');

async function generateDailyReport() {
  const trader = new AlpacaTrader();
  const account = await trader.getAccount();
  const stats = trader.getStats();
  
  const report = {
    date: new Date().toISOString().split('T')[0],
    account: {
      equity: parseFloat(account.equity),
      cash: parseFloat(account.cash),
      buying_power: parseFloat(account.buying_power)
    },
    performance: {
      daily_pnl: stats.profitLoss,
      trades_taken: stats.positionsOpened,
      positions_closed: stats.positionsClosed,
      win_rate: 0 // Calculate from trades
    },
    trades: stats.trades
  };

  // Save to file
  const reportsDir = path.join(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  const reportPath = path.join(reportsDir, `${report.date}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Print summary
  console.log('\n📊 DAILY TRADING REPORT');
  console.log('========================');
  console.log(`Date: ${report.date}`);
  console.log(`Account Equity: $${report.account.equity.toFixed(2)}`);
  console.log(`Daily P&L: $${report.performance.daily_pnl.toFixed(2)}`);
  console.log(`Trades Taken: ${report.performance.trades_taken}`);
  console.log(`Positions Closed: ${report.performance.positions_closed}`);
  console.log('========================\n');

  // Send notification if configured
  if (process.env.NOTIFY_URL) {
    try {
      await fetch(process.env.NOTIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `Daily Trading Report\nDate: ${report.date}\nP&L: $${report.performance.daily_pnl.toFixed(2)}\nTrades: ${report.performance.trades_taken}`
        })
      });
    } catch (e) {
      console.log('Notification failed:', e.message);
    }
  }
}

generateDailyReport().catch(console.error);
