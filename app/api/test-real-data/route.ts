import { NextResponse } from "next/server";
import { getCurrentMarketState } from "@/lib/trading/current-market-state";
import { canUseRealBinanceClient } from "@/lib/trading/binance";

export async function GET() {
  try {
    // 检查环境变量
    const envInfo = {
      binanceApiKeySet: !!process.env.BINANCE_API_KEY,
      binanceApiSecretSet: !!process.env.BINANCE_API_SECRET,
      binanceApiKey: process.env.BINANCE_API_KEY ? 
        `${process.env.BINANCE_API_KEY.substring(0, 5)}...${process.env.BINANCE_API_KEY.slice(-5)}` : 
        null,
      httpProxy: process.env.HTTP_PROXY,
      httpsProxy: process.env.HTTPS_PROXY,
      binanceUseSandbox: process.env.BINANCE_USE_SANDBOX,
    };
    
    // 检查是否可以使用真实的Binance客户端
    const canUseReal = canUseRealBinanceClient();
    
    // 获取市场数据
    const marketData = await getCurrentMarketState("BTC/USDT", false);
    
    // 判断是否为真实数据
    const isRealData = marketData.current_price > 1000; // BTC价格应该远大于1000
    
    return NextResponse.json({
      success: true,
      envInfo,
      canUseReal,
      isRealData,
      marketData: {
        current_price: marketData.current_price,
        current_ema20: marketData.current_ema20,
        current_macd: marketData.current_macd,
        current_rsi: marketData.current_rsi,
      },
      dataType: isRealData ? "REAL_BINANCE_DATA" : "MOCK_DATA"
    });
  } catch (error: any) {
    console.error("Error in test-real-data:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Unknown error",
    }, { status: 500 });
  }
}