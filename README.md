# Paper Trading System

**Broker:** Alpaca
**Account:** Paper Trading
**Strategy:** Momentum-based swing trading
**Risk Management:**
- Max $100 per trade
- Max $20 loss per trade (stop-loss)
- Daily position limit: 5 trades max

## Strategy: Simple Momentum

**Entry Conditions:**
- Stock up >2% in last 15 minutes
- Volume > 1.5x average
- Price between $5-$100 (liquid, affordable)

**Exit Conditions:**
- +5% profit target
- -$20 loss stop
- Time-based: Close EOD if neither hit

**Assets:** Top 100 S&P 500 tickers

## Safeguards
- Paper trading only until proven profitable 30+ days
- No trades first/last 30 min of market (volatility)
- Max 1 trade per 10 minutes (rate limiting)
- No meme stocks (filter by market cap >$1B)

## Reporting
- Daily summary at 4:30 PM ET
- Real-time stats via web UI
- Weekly performance review
