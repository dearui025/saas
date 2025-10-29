import { NextResponse } from "next/server";

export async function GET() {
  // 检查环境变量
  const binanceApiKeySet = !!process.env.BINANCE_API_KEY;
  const binanceApiSecretSet = !!process.env.BINANCE_API_SECRET;
  
  return NextResponse.json({
    binanceApiKeySet,
    binanceApiSecretSet,
    httpProxy: process.env.HTTP_PROXY,
    httpsProxy: process.env.HTTPS_PROXY,
    binanceUseSandbox: process.env.BINANCE_USE_SANDBOX,
  });
}