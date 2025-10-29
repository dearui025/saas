import ccxt from "ccxt";

export const binance = new ccxt.binance({
  apiKey: process.env.BINANCE_API_KEY,
  secret: process.env.BINANCE_API_SECRET,
  options: {
    defaultType: "future",
  },
});

binance.setSandboxMode(process.env.BINANCE_USE_SANDBOX === "true");

// 创建用户特定的Binance客户端
export function createBinanceClient(apiKey: string, apiSecret: string, sandbox: boolean = true) {
  const client = new ccxt.binance({
    apiKey,
    secret: apiSecret,
    options: {
      defaultType: "future",
    },
  });

  client.setSandboxMode(sandbox);
  return client;
}
