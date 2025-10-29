import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // 测试数据库连接 - 查询用户表是否存在
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: '数据库连接测试失败'
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Supabase 连接成功',
      data: data
    })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message || '未知错误',
      details: '服务器内部错误'
    }, { status: 500 })
  }
}