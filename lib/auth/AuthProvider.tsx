"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // 加载用户
  useEffect(() => {
    async function loadUser() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } finally {
        setLoading(false);
      }
    }
    loadUser();

    // 监听认证状态变化 - 保持简单，不使用async操作
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // 登录
  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    if (error) throw error;
    return data;
  }

  // 注册
  async function signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;

    // 创建用户配置
    if (data.user) {
      // 使用服务端客户端来绕过RLS限制
      const serverSupabase = await createServerClient();
      
      const { error: profileError } = await serverSupabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
          },
        ]);
      
      if (profileError) {
        console.error('创建用户配置失败:', profileError);
        console.error('用户ID:', data.user.id);
        console.error('用户邮箱:', data.user.email);
        console.error('用户全名:', fullName);
        // 抛出错误以便上层能够处理
        throw new Error(`创建用户配置失败: ${profileError.message || '未知错误'}`);
      }

      // 创建默认API密钥记录
      const { error: apiKeyError } = await serverSupabase
        .from('user_api_keys')
        .insert([
          {
            user_id: data.user.id,
            binance_use_sandbox: true,
            start_money: 10000,
            trading_enabled: false,
          },
        ]);
      
      if (apiKeyError) {
        console.error('创建API密钥记录失败:', apiKeyError);
        console.error('用户ID:', data.user.id);
        // 抛出错误以便上层能够处理
        throw new Error(`创建API密钥记录失败: ${apiKeyError.message || '未知错误'}`);
      }
    }
    
    return data;
  }

  // 登出
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
