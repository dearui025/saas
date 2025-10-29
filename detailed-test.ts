// 环境变量应该已经由Next.js加载
console.log("Environment variables:");
console.log("BINANCE_API_KEY:", process.env.BINANCE_API_KEY ? "SET" : "NOT SET");
console.log("BINANCE_API_SECRET:", process.env.BINANCE_API_SECRET ? "SET" : "NOT SET");
console.log("HTTP_PROXY:", process.env.HTTP_PROXY);
console.log("HTTPS_PROXY:", process.env.HTTPS_PROXY);

import { canUseRealBinanceClient } from "@/lib/trading/binance";
import { getCurrentMarketState } from "@/lib/trading/current-market-state";

async function detailedTest() {
  console.log("Can use real Binance client:", canUseRealBinanceClient());
  
  if (canUseRealBinanceClient()) {
    console.log("Fetching real market data...");
    try {
      const btcData = await getCurrentMarketState("BTC/USDT", false);
      console.log("BTC Data:", {
        current_price: btcData.current_price,
        isReal: btcData.current_price > 1000 // 真实的BTC价格应该远大于1000
      });
    } catch (error) {
      console.error("Error fetching market data:", error);
    }
  } else {
    console.log("Using mock data...");
    const mockData = await getCurrentMarketState("BTC/USDT", false);
    console.log("Mock BTC Data:", {
      current_price: mockData.current_price,
      isMock: true
    });
  }
}

detailedTest();