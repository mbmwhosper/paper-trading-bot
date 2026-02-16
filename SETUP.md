# Paper Trading Bot Setup

## 1. Get Alpaca API Keys

1. Go to https://alpaca.markets/
2. Sign up for a free account
3. Go to **Paper Trading** section
4. Generate API keys
5. Copy the **API Key ID** and **Secret Key**

## 2. Configure

```bash
cd trading-system
cp .env.example .env
# Edit .env and add your Alpaca API keys
```

## 3. Install & Run

```bash
npm install
npm start
```

This will:
- Start the trading bot (scans every minute)
- Start the web UI at http://localhost:3456
- Begin monitoring positions every 30 seconds

## 4. View Dashboard

Open http://localhost:3456 in your browser

The dashboard shows:
- Account equity
- Today's P&L
- Current positions
- Trading status
- All trades taken today

## 5. Daily Reports

To generate a daily report (run at market close):

```bash
npm run daily-report
```

Reports are saved to `reports/YYYY-MM-DD.json`

## Strategy Details

**Momentum-based swing trading:**
- Scans for stocks up >2% in last 15 minutes with high volume
- Buys top momentum stock if within $5-$100 range
- Targets 5% profit or $20 loss stop
- Closes positions EOD if neither hit
- Max 5 trades per day, 10 minutes apart
- No trading first/last 30 minutes of market

## Risk Limits

- Max $100 per trade
- Max $20 loss per trade (hard stop)
- Max 5 trades per day
- Paper trading only (no real money)

## Access Anywhere

To access the UI from anywhere:

1. **Tailscale:** Install Tailscale, share the machine
2. **ngrok:** `ngrok http 3456` (temporary)
3. **Cloudflare Tunnel:** Free permanent URL

Or deploy to a VPS/cloud server for 24/7 access.
