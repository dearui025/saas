import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
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
  return NextResponse.json({ message: 'Test API is working' })
}