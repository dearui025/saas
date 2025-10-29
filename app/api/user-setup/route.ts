import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    console.log('User setup API POST called')
    
    // 检查请求方法
    if (request.method !== 'POST') {
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: `Method ${request.method} not allowed, expected POST` 
        }),
        { 
          status: 405,
          headers: {
            'Content-Type': 'application/json',
            'Allow': 'POST'
          }
        }
      )
    }
    
    // 确保请求体存在
    if (!request.body) {
      return NextResponse.json(
        { success: false, error: '请求体为空' },
        { status: 400 }
      )
    }
    
    const { user_id, email, full_name } = await request.json()
    
    if (!user_id || !email) {
      return NextResponse.json(
        { success: false, error: '缺少必要的用户信息' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // 创建用户配置
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: user_id,
          email: email,
          full_name: full_name || '',
        },
      ])
    
    if (profileError) {
      console.error('创建用户配置失败:', profileError)
      return NextResponse.json(
        { success: false, error: `创建用户配置失败: ${profileError.message}` },
        { status: 500 }
      )
    }
    
    // 创建默认API密钥记录
    const { error: apiKeyError } = await supabase
      .from('user_api_keys')
      .insert([
        {
          user_id: user_id,
          binance_use_sandbox: true,
          start_money: 10000,
          trading_enabled: false,
        },
      ])
    
    if (apiKeyError) {
      console.error('创建API密钥记录失败:', apiKeyError)
      return NextResponse.json(
        { success: false, error: `创建API密钥记录失败: ${apiKeyError.message}` },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true, message: '用户设置完成' })
  } catch (error: any) {
    console.error('用户设置过程中发生错误:', error)
    // 确保始终返回有效的JSON响应
    return NextResponse.json(
      { success: false, error: error.message || '服务器内部错误' },
      { status: 500 }
    )
  }
}

// 添加对其他HTTP方法的处理
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Allow': 'POST, OPTIONS',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}