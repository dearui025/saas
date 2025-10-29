"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function DebugAuthPage() {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchDebugInfo() {
      if (!user) return;
      
      try {
        const supabase = createClient();
        
        // 获取用户会话信息
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        // 检查用户在profiles表中的信息
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        // 检查用户在user_api_keys表中的信息
        const { data: apiKeyData, error: apiKeyError } = await supabase
          .from('user_api_keys')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setDebugInfo({
          user,
          session: sessionData?.session,
          profile: profileData,
          apiKey: apiKeyData,
          profileError: profileError?.message || profileError,
          apiKeyError: apiKeyError?.message || apiKeyError,
          sessionError: sessionError?.message || sessionError
        });
      } catch (err: any) {
        console.error('获取调试信息失败:', err);
        setError(err.message || "获取调试信息失败");
      }
    }
    
    fetchDebugInfo();
  }, [user]);

  async function handleSignOut() {
    try {
      await signOut();
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "登出失败");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">认证调试页面</h1>
          {user && (
            <button 
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              登出
            </button>
          )}
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
            <h2 className="font-bold mb-2">错误信息</h2>
            <p>{error}</p>
          </div>
        )}
        
        <div className="bg-card rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">认证状态</h2>
          {user ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">用户信息</h3>
                <pre className="bg-muted p-4 rounded mt-2 text-sm overflow-x-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
              
              {debugInfo && (
                <>
                  <div>
                    <h3 className="font-medium">会话信息</h3>
                    <pre className="bg-muted p-4 rounded mt-2 text-sm overflow-x-auto">
                      {JSON.stringify(debugInfo.session, null, 2)}
                    </pre>
                    {debugInfo.sessionError && (
                      <p className="text-red-500 mt-2">会话错误: {debugInfo.sessionError}</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium">用户配置信息</h3>
                    <pre className="bg-muted p-4 rounded mt-2 text-sm overflow-x-auto">
                      {JSON.stringify(debugInfo.profile, null, 2)}
                    </pre>
                    {debugInfo.profileError && (
                      <p className="text-red-500 mt-2">配置信息错误: {debugInfo.profileError}</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium">API密钥信息</h3>
                    <pre className="bg-muted p-4 rounded mt-2 text-sm overflow-x-auto">
                      {JSON.stringify(debugInfo.apiKey, null, 2)}
                    </pre>
                    {debugInfo.apiKeyError && (
                      <p className="text-red-500 mt-2">API密钥信息错误: {debugInfo.apiKeyError}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">未登录</p>
              <div className="space-x-4">
                <a href="/login" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
                  去登录
                </a>
                <a href="/signup" className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90">
                  去注册
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}