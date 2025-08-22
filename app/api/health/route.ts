import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Hello from the SaaS Template API!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    status: 'healthy',
  })
}
