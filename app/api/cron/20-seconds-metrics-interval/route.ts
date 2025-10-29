import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getAccountInformationAndPerformance } from "@/lib/trading/account-information-and-performance";
import { createClient } from "@/lib/supabase/server";

// maximum number of metrics to keep
const MAX_METRICS_COUNT = 100;

/**
 * uniformly sample the array, keeping the first and last elements unchanged
 * @param data - the original data array
 * @param maxSize - the maximum number of metrics to keep
 * @returns the sampled data array
 */
function uniformSampleWithBoundaries<T>(data: T[], maxSize: number): T[] {
  if (data.length <= maxSize) {
    return data;
  }

  const result: T[] = [];
  const step = (data.length - 1) / (maxSize - 1);

  for (let i = 0; i < maxSize; i++) {
    const index = Math.round(i * step);
    result.push(data[index]);
  }

  return result;
}

export const GET = async (request: NextRequest) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return new Response("Token is required", { status: 400 });
  }

  try {
    jwt.verify(token, process.env.CRON_SECRET_KEY || "");
  } catch {
    return new Response("Invalid token", { status: 401 });
  }

  try {
    const supabase = await createClient();

    // 获取所有启用了交易的用户
    const { data: users, error: usersError } = await supabase
      .from("user_api_keys")
      .select("user_id, binance_api_key, binance_api_secret, binance_use_sandbox, start_money, trading_enabled")
      .eq("trading_enabled", true);

    if (usersError) {
      console.error("获取用户失败:", usersError);
      return new Response("获取用户失败", { status: 500 });
    }

    if (!users || users.length === 0) {
      return new Response("没有启用交易的用户", { status: 200 });
    }

    // 为每个用户收集指标
    const results = await Promise.allSettled(
      users.map(async (userConfig) => {
        try {
          // 使用用户的API密钥获取账户信息
          const accountInfo = await getAccountInformationAndPerformance(
            userConfig.start_money || 10000,
            {
              apiKey: userConfig.binance_api_key,
              apiSecret: userConfig.binance_api_secret,
              sandbox: userConfig.binance_use_sandbox,
            }
          );

          // 获取用户现有的metrics记录
          const { data: existMetrics } = await supabase
            .from("metrics")
            .select("*")
            .eq("user_id", userConfig.user_id)
            .eq("model", "Deepseek")
            .maybeSingle();

          let metricsRecord = existMetrics;

          if (!metricsRecord) {
            // 创建新的metrics记录
            const { data: newMetrics, error: createError } = await supabase
              .from("metrics")
              .insert({
                user_id: userConfig.user_id,
                name: "20-seconds-metrics",
                metrics: [],
                model: "Deepseek",
              })
              .select()
              .single();

            if (createError) {
              console.error("创建metrics失败:", createError);
              return;
            }
            metricsRecord = newMetrics;
          }

          // 添加新指标
          const currentMetrics = (metricsRecord?.metrics || []) as any[];
          const newMetrics = [
            ...currentMetrics,
            {
              accountInformationAndPerformance: accountInfo,
              createdAt: new Date().toISOString(),
            },
          ];

          // 如果超过最大数量，均匀采样
          let finalMetrics = newMetrics;
          if (newMetrics.length > MAX_METRICS_COUNT) {
            finalMetrics = uniformSampleWithBoundaries(newMetrics, MAX_METRICS_COUNT);
          }

          // 更新metrics
          const { error: updateError } = await supabase
            .from("metrics")
            .update({
              metrics: finalMetrics,
              updated_at: new Date().toISOString(),
            })
            .eq("id", metricsRecord.id);

          if (updateError) {
            console.error("更新metrics失败:", updateError);
          }

          return { userId: userConfig.user_id, success: true, metricsCount: finalMetrics.length };
        } catch (error) {
          console.error(`处理用户 ${userConfig.user_id} 失败:`, error);
          return { userId: userConfig.user_id, success: false, error };
        }
      })
    );

    const successCount = results.filter((r) => r.status === "fulfilled" && r.value?.success).length;

    return new Response(
      `处理完成。成功: ${successCount}/${users.length} 个用户`,
      { status: 200 }
    );
  } catch (error) {
    console.error("Cron任务执行失败:", error);
    return new Response("Cron任务执行失败", { status: 500 });
  }
};
