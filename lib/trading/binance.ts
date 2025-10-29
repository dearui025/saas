import ccxt from "ccxt";
import { createClient } from "@/lib/supabase/server";
import { getMockMarketState } from "@/lib/trading/mock-market-data";

// 检查是否配置了Binance API密钥
const hasBinanceCredentials = () => {
  return !!(process.env.BINANCE_API_KEY && process.env.BINANCE_API_SECRET);
};

// 获取代理设置
const getProxyConfig = () => {
  // 检查环境变量中的代理设置
  const httpProxy = process.env.HTTP_PROXY || process.env.HTTPS_PROXY || 'http://127.0.0.1:7890';
  return httpProxy;
};

// 创建默认的Binance客户端
const createDefaultBinanceClient = () => {
  // 如果没有配置API密钥，返回null
  if (!hasBinanceCredentials()) {
    return null;
  }
  
  const client = new ccxt.binance({
    apiKey: process.env.BINANCE_API_KEY,
    secret: process.env.BINANCE_API_SECRET,
    options: {
      defaultType: "future",
    },
    // 添加代理支持
    httpProxy: getProxyConfig(),
  });

  client.setSandboxMode(process.env.BINANCE_USE_SANDBOX === "true");
  return client;
};

// 创建默认的Binance客户端实例
const defaultBinanceClient = createDefaultBinanceClient();

export const binance = defaultBinanceClient;

// 创建用户特定的Binance客户端
export function createBinanceClient(apiKey: string, apiSecret: string, sandbox: boolean = true) {
  const client = new ccxt.binance({
    apiKey,
    secret: apiSecret,
    options: {
      defaultType: "future",
    },
    // 添加代理支持
    httpProxy: getProxyConfig(),
  });

  client.setSandboxMode(sandbox);
  return client;
}

// 获取当前用户的Binance客户端
export async function getCurrentUserBinanceClient() {
  try {
    // 获取当前用户
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      // 如果没有用户，返回默认客户端
      return binance;
    }

    // 获取用户的API密钥
    const { data: apiKeyData, error } = await supabase
      .from("user_api_keys")
      .select("binance_api_key, binance_api_secret, binance_use_sandbox")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !apiKeyData || !apiKeyData.binance_api_key || !apiKeyData.binance_api_secret) {
      // 如果用户没有配置API密钥，返回默认客户端
      return binance;
    }

    // 创建用户特定的客户端
    return createBinanceClient(
      apiKeyData.binance_api_key,
      apiKeyData.binance_api_secret,
      apiKeyData.binance_use_sandbox
    );
  } catch (error) {
    console.error("Error getting user Binance client:", error);
    // 出错时返回默认客户端
    return binance;
  }
}

// 获取默认的Binance客户端（用于API路由等无用户上下文的场景）
export function getDefaultBinanceClient() {
  return binance;
}

// 检查是否可以使用真实的Binance客户端
export function canUseRealBinanceClient(): boolean {
  return !!binance;
}