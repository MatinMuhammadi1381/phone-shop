import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

const ADMIN_USERNAME = 'Matin_0081'
const ADMIN_PASSWORD = 'Matin@1381'
const ADMIN_COOKIE = 'tmobile_admin'
const SECRET = crypto.randomBytes(64).toString('hex')

function signToken(payload: string): string {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('hex')
}

export async function setAdminCookie(): Promise<NextResponse> {
  const payload = `${ADMIN_USERNAME}:${ADMIN_PASSWORD}`
  const sig = signToken(payload)
  const response = NextResponse.json({ success: true })
  response.cookies.set(ADMIN_COOKIE, `${payload}.${sig}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 2,
    priority: 'high',
  })
  return response
}

export async function clearAdminCookie(): Promise<NextResponse> {
  const response = NextResponse.json({ success: true })
  response.cookies.set(ADMIN_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return response
}

async function getAdminCookie(): Promise<string | null> {
  const store = await cookies()
  const c = store.get(ADMIN_COOKIE)
  return c?.value ?? null
}

export async function checkAdmin(): Promise<boolean> {
  try {
    const raw = await getAdminCookie()
    if (!raw) return false
    const idx = raw.lastIndexOf('.')
    if (idx === -1 || idx === 0) return false
    const payload = raw.slice(0, idx)
    const sig = raw.slice(idx + 1)
    const expected = signToken(payload)
    if (sig.length !== expected.length) return false
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  } catch {
    return false
  }
}

export async function requireAdmin(): Promise<NextResponse | null> {
  if (await checkAdmin()) return null
  return NextResponse.json({ error: 'دسترسی غیرمجاز' }, { status: 401 })
}