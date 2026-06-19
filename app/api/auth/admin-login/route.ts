import { NextResponse } from 'next/server'
import { setAdminCookie } from '@/lib/admin-auth'
import crypto from 'crypto'

const ADMIN_USERNAME = 'Matin_0081'
const ADMIN_PASSWORD = 'Matin@1381'

export async function POST(request: Request) {
  const { username, password } = await request.json()

  if (typeof username !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'اطلاعات وارد شده ناقص است' }, { status: 400 })
  }

  const userBuf = Buffer.from(username)
  const expectedUserBuf = Buffer.from(ADMIN_USERNAME)
  const passBuf = Buffer.from(password)
  const expectedPassBuf = Buffer.from(ADMIN_PASSWORD)

  const userMatch = userBuf.length === expectedUserBuf.length
    && crypto.timingSafeEqual(userBuf, expectedUserBuf)
  const passMatch = passBuf.length === expectedPassBuf.length
    && crypto.timingSafeEqual(passBuf, expectedPassBuf)

  if (!userMatch || !passMatch) {
    return NextResponse.json({ error: 'نام کاربری یا رمز اشتباه است' }, { status: 401 })
  }

  return await setAdminCookie()
}