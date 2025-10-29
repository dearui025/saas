"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function TestSupabasePage() {
  const [connectionStatus, setConnectionStatus] = useState<string>("测试中...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient();
        
        // 测试连接 - 尝试获取当前用户信息
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          setConnectionStatus("连接失败");
          setError(error.message);
        } else if (user) {
          setConnectionStatus("连接成功 - 已登录用户");
        } else {
          setConnectionStatus("连接成功 - 未登录状态");
        }
      } catch (err: any) {
        setConnectionStatus("连接失败");
        setError(err.message || "未知错误");
      }
    }

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Supabase 连接测试</h1>
          
          <div className="bg-card rounded-lg p-6 shadow-lg">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">连接状态</h2>
              <p className={`text-lg ${connectionStatus.includes("成功") ? "text-green-500" : "text-red-500"}`}>
                {connectionStatus}
              </p>
            </div>
            
            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg">
                <h3 className="font-medium text-red-500">错误信息</h3>
                <p className="text-red-500 mt-1 text-sm">{error}</p>
              </div>
            )}
            
            <div className="mt-6 text-left">
              <h3 className="font-medium mb-2">配置信息</h3>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">URL:</span> {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
                <p><span className="font-medium">Key:</span> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <a href="/" className="text-primary hover:underline">
              返回首页
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}