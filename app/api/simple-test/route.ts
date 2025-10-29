import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    console.log('Simple test API POST called')
    
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
    
    return NextResponse.json({ success: true, message: 'Simple test successful' })
  } catch (error: any) {
    console.error('Simple test API error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    console.log('Simple test API GET called')
    
    return NextResponse.json({ message: 'Simple test API is working' })
  } catch (error: any) {
    console.error('Simple test API error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// 添加对其他HTTP方法的处理
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Allow': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}