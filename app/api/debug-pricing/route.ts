import { NextResponse } from "next/server";
import { getCurrentMarketState } from "@/lib/trading/current-market-state";
import { canUseRealBinanceClient, binance } from "@/lib/trading/binance";

export async function GET() {
  try {
    // 详细检查环境变量
    const debugInfo = {
      envVars: {
        BINANCE_API_KEY: process.env.BINANCE_API_KEY ? 
          `SET (length: ${process.env.BINANCE_API_KEY.length})` : 
          'NOT SET',
        BINANCE_API_SECRET: process.env.BINANCE_API_SECRET ? 
          `SET (length: ${process.env.BINANCE_API_SECRET.length})` : 
          'NOT SET',
        HTTP_PROXY: process.env.HTTP_PROXY,
        HTTPS_PROXY: process.env.HTTPS_PROXY,
        BINANCE_USE_SANDBOX: process.env.BINANCE_USE_SANDBOX,
      },
      binanceClient: {
        clientExists: !!binance,
        canUseRealBinance: canUseRealBinanceClient(),
      }
    };
    
    console.log("Debug pricing info:", debugInfo);
    
    // 获取BTC数据并检查是否为真实数据
    const btcData = await getCurrentMarketState("BTC/USDT", false);
    const isRealData = btcData.current_price > 10000; // BTC价格应该远大于10000
    
    // 获取ETH数据
    const ethData = await getCurrentMarketState("ETH/USDT", false);
    const isEthRealData = ethData.current_price > 100; // ETH价格应该大于100
    
    return NextResponse.json({
      success: true,
      debugInfo,
      pricingData: {
        btc: {
          current_price: btcData.current_price,
          isRealData,
          dataType: isRealData ? "REAL_BINANCE_DATA" : "MOCK_DATA"
        },
        eth: {
          current_price: ethData.current_price,
          isRealData: isEthRealData,
          dataType: isEthRealData ? "REAL_BINANCE_DATA" : "MOCK_DATA"
        }
      },
      overall: isRealData && isEthRealData ? "REAL_DATA" : "MOCK_DATA"
    });
  } catch (error: any) {
    console.error("Error in debug-pricing:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Unknown error",
    }, { status: 500 });
  }
}