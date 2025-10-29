"use client";

import { useEffect, useState, useCallback } from "react";
import { MetricsChart } from "@/components/metrics-chart";
import { CryptoCard } from "@/components/crypto-card";
import { ModelsView } from "@/components/models-view";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MarketState } from "@/lib/trading/current-market-state";
import { MetricData } from "@/lib/types/metrics";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CryptoPricing {
  btc: MarketState;
  eth: MarketState;
  sol: MarketState;
  doge: MarketState;
  bnb: MarketState;
}

interface MetricsResponse {
  data: {
    metrics: MetricData[];
    totalCount: number;
    model: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  success: boolean;
}

interface PricingResponse {
  data: {
    pricing: CryptoPricing;
  };
  success: boolean;
}

export default function Home() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [metricsData, setMetricsData] = useState<MetricData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pricing, setPricing] = useState<CryptoPricing | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  // 获取图表数据
  const fetchMetrics = useCallback(async () => {
    try {
      const response = await fetch("/api/metrics");
      if (!response.ok) return;

      const data: MetricsResponse = await response.json();
      if (data.success && data.data) {
        setMetricsData(data.data.metrics || []);
        setTotalCount(data.data.totalCount || 0);
        setLastUpdate(new Date().toLocaleTimeString());
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching metrics:", err);
      setLoading(false);
    }
  }, []);

  // 获取价格数据
  const fetchPricing = useCallback(async () => {
    try {
      const response = await fetch("/api/pricing");
      if (!response.ok) return;

      const data: PricingResponse = await response.json();
      if (data.success && data.data.pricing) {
        setPricing(data.data.pricing);
      }
    } catch (err) {
      console.error("Error fetching pricing:", err);
    }
  }, []);

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  useEffect(() => {
    // 只有在用户已认证且不在加载状态时才获取数据
    if (authLoading) return;
    
    // 初始加载
    fetchMetrics();
    fetchPricing();

    const metricsInterval = setInterval(fetchMetrics, 10000);

    const pricingInterval = setInterval(fetchPricing, 10000);

    return () => {
      clearInterval(metricsInterval);
      clearInterval(pricingInterval);
    };
  }, [authLoading, fetchMetrics, fetchPricing]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Open Nof1.ai
              <span className="text-muted-foreground text-sm ml-2">
                inspired by Alpha Arena
              </span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Real-time trading metrics and performance
            </p>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Link href="/settings">
                  <Button variant="outline">设置</Button>
                </Link>
                <Button onClick={handleSignOut} variant="outline">
                  登出
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Time Info */}
        {lastUpdate && (
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Last updated</div>
            <div className="text-lg font-mono">{lastUpdate}</div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-8 border-b pb-4">
          <button className="text-sm font-medium border-b-2 border-primary pb-2">
            LIVE
          </button>
        </div>

        {/* Crypto Ticker */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {pricing ? (
            <>
              <CryptoCard
                symbol="BTC"
                name="Bitcoin"
                price={`$${pricing.btc.current_price.toLocaleString()}`}
              />
              <CryptoCard
                symbol="ETH"
                name="Ethereum"
                price={`$${pricing.eth.current_price.toLocaleString()}`}
              />
              <CryptoCard
                symbol="SOL"
                name="Solana"
                price={`$${pricing.sol.current_price.toLocaleString()}`}
              />
              <CryptoCard
                symbol="BNB"
                name="BNB"
                price={`$${pricing.bnb.current_price.toLocaleString()}`}
              />
              <CryptoCard
                symbol="DOGE"
                name="Dogecoin"
                price={`$${pricing.doge.current_price.toFixed(4)}`}
              />
            </>
          ) : (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="p-4 animate-pulse">
                <div className="h-20 bg-muted rounded"></div>
              </Card>
            ))
          )}
        </div>

        {/* Main Content - Chart and Models Side by Side */}
        <div className="flex flex-row gap-6">
          {/* Left: Chart */}
          <div className="flex-[2]">
            <MetricsChart
              metricsData={metricsData}
              loading={loading}
              lastUpdate={lastUpdate}
              totalCount={totalCount}
            />
          </div>

          {/* Right: Models View */}
          <div className="flex-1">
            <ModelsView />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-8 border-t">
          <p>HIGHEST: 🏆 DEEPSEEK CHAT</p>
          <p className="mt-2">nof1.ai - Real-time AI Trading Platform</p>
        </div>
      </div>
    </div>
  );
}