import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    console.log('Test API POST called')
    
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
    
    const data = await request.json()
    console.log('Received data:', data)
    return NextResponse.json({ success: true, message: 'Test successful', received: data })
  } catch (error: any) {
    console.error('Test API error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    console.log('Test API GET called')
    return NextResponse.json({ message: 'Test API is working' })
  } catch (error: any) {
    console.error('Test API error:', error)
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