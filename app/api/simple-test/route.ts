import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ success: true, message: 'Simple test successful' })
}

export async function GET() {
  return NextResponse.json({ message: 'Simple test API is working' })
}