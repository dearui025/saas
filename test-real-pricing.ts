import { getCurrentMarketState } from "@/lib/trading/current-market-state";
import { canUseRealBinanceClient } from "@/lib/trading/binance";

async function testRealPricing() {
  try {
    console.log("Testing real pricing data...");
    
    // 检查是否可以使用真实的Binance客户端
    console.log("Can use real Binance client:", canUseRealBinanceClient());
    
    // 获取BTC价格数据
    console.log("Fetching BTC pricing data...");
    const btcPricing = await getCurrentMarketState("BTC/USDT", false);
    console.log("BTC Pricing:", btcPricing);
    
    // 获取ETH价格数据
    console.log("Fetching ETH pricing data...");
    const ethPricing = await getCurrentMarketState("ETH/USDT", false);
    console.log("ETH Pricing:", ethPricing);
    
    console.log("Real pricing test completed!");
  } catch (error) {
    console.error("Real pricing test failed:", error);
  }
}

testRealPricing();