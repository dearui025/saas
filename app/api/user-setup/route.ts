import { createAdminClient } from '@/lib/supabase/server'
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
    
    // 使用管理员客户端（带有服务角色密钥）来绕过RLS策略
    const supabase = await createAdminClient()
    
    // 首先检查用户是否确实存在于auth.users表中
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user_id)
      .single()
    
    if (userError || !userData) {
      console.log('用户尚未在auth.users表中创建，稍后重试')
      // 如果用户不存在，我们返回成功但不创建配置
      // 配置将在用户确认邮箱后通过其他方式创建
      return NextResponse.json({ 
        success: true, 
        message: '用户注册成功，配置将在稍后创建',
        deferred: true
      })
    }
    
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
      // 如果是外键约束错误，返回特殊消息
      if (profileError.message.includes('foreign key constraint')) {
        return NextResponse.json({ 
          success: true, 
          message: '用户注册成功，配置将在稍后创建',
          deferred: true
        })
      }
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