import { NextResponse } from "next/server";
import ccxt from "ccxt";

export async function GET() {
  try {
    // 检查环境变量
    const hasApiKey = !!process.env.BINANCE_API_KEY;
    const hasApiSecret = !!process.env.BINANCE_API_SECRET;
    
    console.log("Binance API Key set:", hasApiKey);
    console.log("Binance API Secret set:", hasApiSecret);
    
    if (!hasApiKey || !hasApiSecret) {
      return NextResponse.json({
        success: false,
        error: "Binance API credentials not set",
        envInfo: {
          hasApiKey,
          hasApiSecret,
          apiKeyLength: process.env.BINANCE_API_KEY ? process.env.BINANCE_API_KEY.length : 0,
          apiSecretLength: process.env.BINANCE_API_SECRET ? process.env.BINANCE_API_SECRET.length : 0,
        }
      });
    }
    
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
    
    // 测试连接
    console.log("Loading markets...");
    const markets = await binance.loadMarkets();
    console.log("Markets loaded:", Object.keys(markets).length);
    
    // 获取BTC价格
    console.log("Fetching BTC/USDT ticker...");
    const ticker = await binance.fetchTicker('BTC/USDT');
    console.log("BTC/USDT price:", ticker.last);
    
    return NextResponse.json({
      success: true,
      message: "Binance connection successful",
      btcPrice: ticker.last,
      marketsCount: Object.keys(markets).length,
      envInfo: {
        hasApiKey,
        hasApiSecret,
        apiKeyLength: process.env.BINANCE_API_KEY ? process.env.BINANCE_API_KEY.length : 0,
        apiSecretLength: process.env.BINANCE_API_SECRET ? process.env.BINANCE_API_SECRET.length : 0,
      }
    });
  } catch (error: any) {
    console.error("Binance test error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Unknown error",
    }, { status: 500 });
  }
}