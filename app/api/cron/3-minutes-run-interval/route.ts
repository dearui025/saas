import { run } from "@/lib/ai/run";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from "@/lib/supabase/server";

export const GET = async (request: NextRequest) => {
  // Extract token from query parameters
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return new Response("Token is required", { status: 400 });
  }

  try {
    jwt.verify(token, process.env.CRON_SECRET_KEY || "");
  } catch (error) {
    return new Response("Invalid token", { status: 401 });
  }

  try {
    const supabase = await createClient();

    // 获取所有启用了交易的用户及其API配置
    const { data: users, error: usersError } = await supabase
      .from("user_api_keys")
      .select("user_id, binance_api_key, binance_api_secret, binance_use_sandbox, start_money, deepseek_api_key, trading_enabled")
      .eq("trading_enabled", true);

    if (usersError) {
      console.error("获取用户失败:", usersError);
      return new Response("获取用户失败", { status: 500 });
    }

    if (!users || users.length === 0) {
      return new Response("没有启用交易的用户", { status: 200 });
    }

    // 为每个用户执行交易逻辑
    const results = await Promise.allSettled(
      users.map(async (userConfig) => {
        try {
          // 检查必需的API密钥
          if (!userConfig.deepseek_api_key) {
            console.log(`用户 ${userConfig.user_id} 缺少DeepSeek API密钥，跳过`);
            return { userId: userConfig.user_id, success: false, reason: "缺少DeepSeek API密钥" };
          }

          await run(userConfig.start_money || 10000, {
            userId: userConfig.user_id,
            deepseekApiKey: userConfig.deepseek_api_key,
            binanceApiKey: userConfig.binance_api_key,
            binanceApiSecret: userConfig.binance_api_secret,
            binanceUseSandbox: userConfig.binance_use_sandbox,
            startMoney: userConfig.start_money || 10000,
          });

          return { userId: userConfig.user_id, success: true };
        } catch (error) {
          console.error(`处理用户 ${userConfig.user_id} 交易失败:`, error);
          return { userId: userConfig.user_id, success: false, error };
        }
      })
    );

    const successCount = results.filter((r) => r.status === "fulfilled" && r.value?.success).length;

    return new Response(
      `交易执行完成。成功: ${successCount}/${users.length} 个用户`,
      { status: 200 }
    );
  } catch (error) {
    console.error("Cron任务执行失败:", error);
    return new Response("Cron任务执行失败", { status: 500 });
  }
};
