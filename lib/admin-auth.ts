import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

const ADMIN_COOKIE = 'tmobile_admin'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
// Stable signing secret — must NOT be regenerated on every restart or admin
// sessions will be invalidated (and break across serverless instances).
const SECRET = process.env.ADMIN_SESSION_SECRET ?? ''

if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !SECRET) {
  // surfaced at runtime so misconfigurations are visible instead of silently failing
  console.warn(
    '[admin-auth] ADMIN_USERNAME, ADMIN_PASSWORD and ADMIN_SESSION_SECRET must be set in the environment.'
  )
}

function signToken(payload: string): string {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('hex')
}

export async function setAdminCookie(): Promise<NextResponse> {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !SECRET) {
    return NextResponse.json(
      { error: 'تنظیمات ادمین در سرور پیکربندی نشده است' },
      { status: 500 }
    )
  }
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
    // Without a stable secret, any previously issued token is unverifiable.
    if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !SECRET) return false
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