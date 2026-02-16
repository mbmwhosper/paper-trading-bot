# Paper Trading Bot - Setup & Deployment

## Quick Start (Local)

```bash
cd trading-system
npm install

# Create .env file
cp .env.example .env
# Edit .env with your Alpaca API keys

npm start
# UI available at http://localhost:3456
```

## Deploy to Render.com (Access From Anywhere)

### Step 1: Push to GitHub

```bash
cd trading-system
git init
git add .
git commit -m "Initial trading bot"
git remote add origin https://github.com/YOUR_USERNAME/paper-trading-bot.git
git push -u origin main
```

### Step 2: Deploy on Render

1. Go to [render.com](https://render.com) and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Select the repo: `paper-trading-bot`
5. Configure:
   - **Name:** `paper-trading-bot`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
6. Add Environment Variables:
   - `ALPACA_API_KEY` = your_key_here
   - `ALPACA_SECRET_KEY` = your_secret_here
7. Click **Create Web Service**

### Step 3: Access Your Dashboard

After deployment (~2 minutes), you'll get a URL like:
```
https://paper-trading-bot-xxx.onrender.com
```

Open this URL on any device - desktop, iPhone, iPad, Android.

---

## iOS "Add to Home Screen"

1. Open the deployed URL in Safari
2. Tap **Share** button (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **Add**

Now it appears as a native app icon on your home screen:
- Full-screen experience (no Safari chrome)
- Dark theme with system fonts
- Pull-to-refresh works
- iOS safe-area support (notch, home indicator)

---

## Alternative: Self-Hosted (Tailscale/Cloudflare)

If you prefer to run on your own hardware:

### Tailscale (Free, Private)
```bash
# Install Tailscale on your machine
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up

# Share the machine
tailscale serve https / http://localhost:3456
```

Access via your Tailscale IP from anywhere on your tailnet.

### Cloudflare Tunnel (Free, Public URL)
```bash
# Install cloudflared
brew install cloudflared  # macOS
# or see https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/

# Create tunnel
cloudflared tunnel create trading-bot
cloudflared tunnel route dns trading-bot trading.yourdomain.com
cloudflared tunnel run trading-bot
```

---

## Strategy Configuration

Edit `src/config.js` to adjust:
- `MAX_POSITION_SIZE` - $ per trade (default: $100)
- `MAX_LOSS_PER_TRADE` - Stop loss (default: $20)
- `MAX_TRADES_PER_DAY` - Daily limit (default: 5)
- `MOMENTUM_THRESHOLD` - % move to trigger (default: 2%)
- `PROFIT_TARGET` - % gain to take profit (default: 5%)

---

## Features

✅ Real-time account equity tracking  
✅ Live P&L updates  
✅ Position monitoring with unrealized gains/losses  
✅ Trade history with timestamps  
✅ Trading status indicator  
✅ Auto-refresh every 10 seconds  
✅ Pull-to-refresh on mobile  
✅ Dark theme optimized for OLED  
✅ iOS native app experience  
✅ Works on any device with a browser  

---

## Troubleshooting

**"Cannot connect to API"**
- Check ALPACA_API_KEY and ALPACA_SECRET_KEY are set correctly
- Ensure you're using paper trading keys (not live)

**UI not loading**
- Check `npm start` is running
- Try http://localhost:3456

**iOS status bar white**
- Normal with `black-translucent` - content scrolls behind it
- Or change to `black` in index.html meta tag

---

## Cost

- **Render Free Tier:** $0 (sleeps after 15 min idle, spins up on request)
- **Alpaca Paper:** $0 (unlimited paper trading)
- **Total:** $0/month

For always-on without sleep delay, upgrade to Render Starter ($7/month).
