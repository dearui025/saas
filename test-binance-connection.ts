import ccxt from "ccxt";

async function testBinanceConnection() {
  try {
    console.log("Testing Binance connection with environment variables...");
    
    // 检查环境变量
    console.log("BINANCE_API_KEY:", process.env.BINANCE_API_KEY ? "SET" : "NOT SET");
    console.log("BINANCE_API_SECRET:", process.env.BINANCE_API_SECRET ? "SET" : "NOT SET");
    
    // 创建Binance客户端
    const binance = new ccxt.binance({
      apiKey: process.env.BINANCE_API_KEY,
      secret: process.env.BINANCE_API_SECRET,
      options: {
        defaultType: "future",
      },
      // 添加代理支持
      httpProxy: process.env.HTTP_PROXY || process.env.HTTPS_PROXY || 'http://127.0.0.1:7890',
    });

    binance.setSandboxMode(process.env.BINANCE_USE_SANDBOX === "true");
    
    // 测试连接
    console.log("Loading markets...");
    const markets = await binance.loadMarkets();
    console.log("Markets loaded:", Object.keys(markets).length);
    
    // 测试获取BTC价格
    console.log("Fetching BTC/USDT ticker...");
    const ticker = await binance.fetchTicker('BTC/USDT');
    console.log("BTC/USDT price:", ticker.last);
    
    console.log("Binance connection test successful!");
  } catch (error) {
    console.error("Binance connection test failed:", error);
  }
}

testBinanceConnection();