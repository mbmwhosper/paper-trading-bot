// Trading Configuration
module.exports = {
  // Risk Limits
  MAX_POSITION_SIZE: 100,      // $100 max per trade
  MAX_LOSS_PER_TRADE: 20,      // $20 stop loss
  MAX_TRADES_PER_DAY: 5,       // Max 5 trades daily
  MIN_TRADE_INTERVAL: 600000,  // 10 minutes between trades
  
  // Strategy Parameters
  MOMENTUM_THRESHOLD: 0.02,    // 2% move
  VOLUME_MULTIPLIER: 1.5,      // 1.5x average volume
  MIN_PRICE: 5,                // $5 minimum
  MAX_PRICE: 100,              // $100 maximum
  MIN_MARKET_CAP: 1000000000,  // $1B market cap
  
  // Trading Hours
  MARKET_OPEN: "09:30",
  MARKET_CLOSE: "16:00",
  NO_TRADE_START: "09:30",     // No trades first 30 min
  NO_TRADE_END: "15:30",       // No trades last 30 min
  
  // Profit/Loss
  PROFIT_TARGET: 0.05,         // 5% profit target
  EOD_CLOSE: true,             // Close positions EOD
  
  // Universe
  TICKERS: [
    "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "BRK.B", "UNH", "JPM",
    "V", "JNJ", "WMT", "PG", "MA", "HD", "CVX", "MRK", "LLY", "ABBV",
    "PEP", "KO", "BAC", "AVGO", "PFE", "TMO", "COST", "DIS", "ABT", "ACN",
    "WFC", "CMCSA", "ADBE", "VZ", "DHR", "NKE", "TXN", "CRM", "LIN", "PM",
    "NEE", "RTX", "AMD", "AMGN", "HON", "QCOM", "SPGI", "UPS", "IBM", "LOW",
    "INTU", "UNP", "BMY", "CAT", "DE", "GS", "LMT", "GILD", "AMAT", "TJX",
    "SBUX", "PLD", "ISRG", "CVS", "EL", "MDLZ", "ADI", "BKNG", "SYK", "TGT",
    "REGN", "SCHW", "ZTS", "CI", "SO", "BDX", "FIS", "LRCX", "CL", "CB",
    "EQIX", "VRTX", "TMUS", "MMC", "ITW", "PGR", "EW", "C", "BSX", "NSC",
    "APD", "AON", "USB", "PNC", "ETN", "COP", "ICE", "MCO", "GM", "F"
  ]
};
