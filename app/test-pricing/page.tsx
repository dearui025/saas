"use client";

import { useEffect, useState } from "react";

interface PricingData {
  current_price: number;
  isRealData: boolean;
  dataType: string;
}

interface DebugData {
  success: boolean;
  debugInfo: any;
  pricingData: {
    btc: PricingData;
    eth: PricingData;
  };
  overall: string;
}

export default function TestPricingPage() {
  const [debugData, setDebugData] = useState<DebugData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/debug-pricing");
        const data: DebugData = await response.json();
        setDebugData(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">错误</h1>
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!debugData) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">无数据</h1>
          <div>未能获取调试数据</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">定价数据测试</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card border rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">BTC 数据</h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium">价格:</span> ${debugData.pricingData.btc.current_price.toLocaleString()}
              </div>
              <div>
                <span className="font-medium">数据类型:</span> 
                <span className={debugData.pricingData.btc.isRealData ? "text-green-500" : "text-red-500"}>
                  {debugData.pricingData.btc.dataType}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">ETH 数据</h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium">价格:</span> ${debugData.pricingData.eth.current_price.toLocaleString()}
              </div>
              <div>
                <span className="font-medium">数据类型:</span> 
                <span className={debugData.pricingData.eth.isRealData ? "text-green-500" : "text-red-500"}>
                  {debugData.pricingData.eth.dataType}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4 mb-8">
          <h2 className="text-xl font-bold mb-4">整体状态</h2>
          <div>
            <span className="font-medium">总体数据类型:</span> 
            <span className={debugData.overall === "REAL_DATA" ? "text-green-500" : "text-red-500"}>
              {debugData.overall}
            </span>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">调试信息</h2>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            {JSON.stringify(debugData.debugInfo, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}