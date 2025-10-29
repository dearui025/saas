import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { MetricData } from "@/lib/types/metrics";

// 最大返回数据点数量
const MAX_DATA_POINTS = 50;

/**
 * 从数组中均匀采样指定数量的元素
 * @param data - 原始数据数组
 * @param sampleSize - 需要采样的数量
 * @returns 均匀分布的采样数据
 */
function uniformSample<T>(data: T[], sampleSize: number): T[] {
  if (data.length <= sampleSize) {
    return data;
  }

  const result: T[] = [];
  const step = (data.length - 1) / (sampleSize - 1);

  for (let i = 0; i < sampleSize; i++) {
    const index = Math.round(i * step);
    result.push(data[index]);
  }

  return result;
}

export const GET = async () => {
  try {
    const supabase = await createClient();

    // 获取当前用户
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({
        error: "未授权",
        success: false,
      }, { status: 401 });
    }

    // 获取用户的最新metrics记录
    const { data: metrics, error } = await supabase
      .from("metrics")
      .select("*")
      .eq("user_id", user.id)
      .eq("model", "Deepseek")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("查询metrics失败:", error);
    }

    if (!metrics) {
      return NextResponse.json({
        data: {
          metrics: [],
          totalCount: 0,
          model: "Deepseek",
          name: "Deepseek Trading Bot",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        success: true,
      });
    }

    const databaseMetrics = metrics.metrics as unknown as {
      createdAt: string;
      accountInformationAndPerformance: MetricData[];
    }[];

    const metricsData = databaseMetrics
      .map((item) => {
        return {
          ...item.accountInformationAndPerformance,
          createdAt: item?.createdAt || new Date().toISOString(),
        };
      })
      .filter((item) => (item as unknown as MetricData).availableCash > 0);

    // 均匀采样数据，最多返回 MAX_DATA_POINTS 条
    const sampledMetrics = uniformSample(metricsData, MAX_DATA_POINTS);

    console.log(
      `📊 User ${user.email} - Total metrics: ${metricsData.length}, Sampled: ${sampledMetrics.length}`
    );

    return NextResponse.json({
      data: {
        metrics: sampledMetrics,
        totalCount: metricsData.length,
        model: metrics?.model || "Deepseek",
        name: metrics?.name || "Deepseek Trading Bot",
        createdAt: metrics?.created_at || new Date().toISOString(),
        updatedAt: metrics?.updated_at || new Date().toISOString(),
      },
      success: true,
    });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json({
      data: {
        metrics: [],
        totalCount: 0,
        model: "Deepseek",
        name: "Deepseek Trading Bot",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      success: true,
    });
  }
};
