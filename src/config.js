// Trading Configuration - $10 Challenge Mode
module.exports = {
  // Risk Limits - AGGRESSIVE $10 CHALLENGE
  MAX_POSITION_SIZE: 10,       // $10 max per trade (changed from $100)
  MAX_LOSS_PER_TRADE: 3,       // $3 stop loss (30% max loss on $10)
  MAX_TRADES_PER_DAY: 10,      // Max 10 trades daily (double normal)
  MIN_TRADE_INTERVAL: 300000,  // 5 minutes between trades (faster)
  
  // Strategy Parameters - MORE AGGRESSIVE
  MOMENTUM_THRESHOLD: 0.015,   // 1.5% move (lower threshold = more trades)
  VOLUME_MULTIPLIER: 1.3,      // 1.3x average volume (easier to qualify)
  MIN_PRICE: 2,                // $2 minimum (cheaper stocks = more shares)
  MAX_PRICE: 50,               // $50 maximum (focus on movers)
  MIN_MARKET_CAP: 500000000,   // $500M market cap (still legit companies)
  
  // Trading Hours - MAXIMIZE TIME
  MARKET_OPEN: "09:30",
  MARKET_CLOSE: "16:00",
  NO_TRADE_START: "09:30",     // Trade immediately at open (more aggressive)
  NO_TRADE_END: "15:55",       // Trade until 5 min before close
  
  // Profit/Loss - QUICK SCALPS
  PROFIT_TARGET: 0.04,         // 4% profit target (lower = faster exits)
  EOD_CLOSE: true,             // MUST close by 4 PM (challenge rule)
  
  // Universe - MORE VOLATILE STOCKS ADDED
  TICKERS: [
    // High volatility tech
    "TSLA", "AMD", "NVDA", "COIN", "PLTR", "HOOD", "SOFI", "RIVN", "LCID",
    // Meme/momentum
    "GME", "AMC", "BB", "NOK", "BBBY",
    // Regular S&P with high beta
    "AAPL", "MSFT", "META", "NFLX", "CRM", "UBER", "ABNB", "SNOW", "ZM",
    "SHOP", "SQ", "PYPL", "ROKU", "TWLO", "DDOG", "NET", "FSLY",
    // Crypto-adjacent
    "MSTR", "MARA", "RIOT", "HUT", "BTBT",
    // Small cap movers
    "SPCE", "ASTS", "RKLB", "JOBY", "ACHR"
  ]
};
