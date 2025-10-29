"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ApiKeys {
  binance_api_key: string;
  binance_api_secret: string;
  binance_use_sandbox: boolean;
  deepseek_api_key: string;
  openrouter_api_key: string;
  exa_api_key: string;
  start_money: number;
  trading_enabled: boolean;
}

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    binance_api_key: "",
    binance_api_secret: "",
    binance_use_sandbox: true,
    deepseek_api_key: "",
    openrouter_api_key: "",
    exa_api_key: "",
    start_money: 10000,
    trading_enabled: false,
  });

  useEffect(() => {
    loadApiKeys();
  }, [user]);

  async function loadApiKeys() {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_api_keys")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setApiKeys({
          binance_api_key: data.binance_api_key || "",
          binance_api_secret: data.binance_api_secret || "",
          binance_use_sandbox: data.binance_use_sandbox,
          deepseek_api_key: data.deepseek_api_key || "",
          openrouter_api_key: data.openrouter_api_key || "",
          exa_api_key: data.exa_api_key || "",
          start_money: data.start_money,
          trading_enabled: data.trading_enabled,
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const { error } = await supabase
        .from("user_api_keys")
        .upsert({
          user_id: user.id,
          ...apiKeys,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      setMessage("设置已保存");
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">账户设置</h1>
            <p className="text-muted-foreground mt-2">
              配置您的交易和AI服务密钥
            </p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            登出
          </Button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {message && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 rounded-lg p-3 text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* 币安API配置 */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">币安交易API</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Binance API Key
                </label>
                <input
                  type="text"
                  value={apiKeys.binance_api_key}
                  onChange={(e) =>
                    setApiKeys({ ...apiKeys, binance_api_key: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="输入您的Binance API Key"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Binance API Secret
                </label>
                <input
                  type="password"
                  value={apiKeys.binance_api_secret}
                  onChange={(e) =>
                    setApiKeys({ ...apiKeys, binance_api_secret: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="输入您的Binance API Secret"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sandbox"
                  checked={apiKeys.binance_use_sandbox}
                  onChange={(e) =>
                    setApiKeys({ ...apiKeys, binance_use_sandbox: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="sandbox" className="text-sm">
                  使用沙盒模式（测试环境）
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  初始资金 (USDT)
                </label>
                <input
                  type="number"
                  value={apiKeys.start_money}
                  onChange={(e) =>
                    setApiKeys({ ...apiKeys, start_money: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  min="10"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="trading"
                  checked={apiKeys.trading_enabled}
                  onChange={(e) =>
                    setApiKeys({ ...apiKeys, trading_enabled: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="trading" className="text-sm font-medium">
                  启用真实交易
                </label>
              </div>
              
              {apiKeys.trading_enabled && !apiKeys.binance_use_sandbox && (
                <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-500 rounded-lg p-3 text-sm">
                  警告：您已启用真实交易模式。请确保您了解交易风险。
                </div>
              )}
            </div>
          </Card>

          {/* AI服务API配置 */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">AI服务API</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  DeepSeek API Key（必需）
                </label>
                <input
                  type="password"
                  value={apiKeys.deepseek_api_key}
                  onChange={(e) =>
                    setApiKeys({ ...apiKeys, deepseek_api_key: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="输入您的DeepSeek API Key"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  OpenRouter API Key（可选）
                </label>
                <input
                  type="password"
                  value={apiKeys.openrouter_api_key}
                  onChange={(e) =>
                    setApiKeys({ ...apiKeys, openrouter_api_key: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="输入您的OpenRouter API Key"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Exa API Key（可选）
                </label>
                <input
                  type="password"
                  value={apiKeys.exa_api_key}
                  onChange={(e) =>
                    setApiKeys({ ...apiKeys, exa_api_key: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="输入您的Exa API Key"
                />
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? "保存中..." : "保存设置"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
            >
              返回首页
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
