import { NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/admin-auth'

export async function GET() {
  const ok = await checkAdmin()
  if (!ok) return NextResponse.json({ admin: false }, { status: 401 })
  return NextResponse.json({ admin: true })
}