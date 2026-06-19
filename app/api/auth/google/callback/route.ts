import { randomBytes } from 'node:crypto'
import { NextResponse } from 'next/server'
import { createSession, hashPassword } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'
const USERINFO_ENDPOINT = 'https://www.googleapis.com/oauth2/v3/userinfo'
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? ''
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI

function isValidClientId(value: string) {
  return Boolean(value) && !/your[-_]?google|your[-_]?client/i.test(value)
}

function getAppBaseUrl(request: Request) {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  const url = new URL(request.url)
  return `${url.protocol}//${url.host}`
}

function getRedirectUri(request: Request) {
  return REDIRECT_URI ?? `${getAppBaseUrl(request)}/api/auth/google/callback`
}

function buildErrorRedirect(request: Request, message: string) {
  const target = new URL('/auth', getAppBaseUrl(request))
  target.searchParams.set('error', message)
  return NextResponse.redirect(target)
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const error = url.searchParams.get('error')
  if (error) {
    return buildErrorRedirect(request, 'ورود گوگل کنسل شد')
  }

  const code = url.searchParams.get('code')
  if (!code) {
    return buildErrorRedirect(request, 'کد ورود گوگل دریافت نشد')
  }

  if (!isValidClientId(CLIENT_ID) || !CLIENT_SECRET) {
    return buildErrorRedirect(request, 'پیکربندی گوگل کامل نیست یا کلاینت اشتباه است')
  }

  const tokenResponse = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: getRedirectUri(request),
      grant_type: 'authorization_code',
    }).toString(),
  })

  const tokenData = await tokenResponse.json().catch(() => ({}))
  if (!tokenResponse.ok || !tokenData.access_token) {
    return buildErrorRedirect(request, tokenData.error_description ?? 'خطا در دریافت توکن گوگل')
  }

  const profileResponse = await fetch(USERINFO_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  })

  const profile = await profileResponse.json().catch(() => ({}))
  if (!profileResponse.ok || !profile.email_verified || !profile.email || !profile.sub) {
    return buildErrorRedirect(request, 'اطلاعات کاربر گوگل معتبر نیست')
  }

  const email = profile.email as string
  const googleId = profile.sub as string
  const fullName = typeof profile.name === 'string' && profile.name.trim().length > 0
    ? profile.name.trim()
    : 'کاربر گوگل'

  const existingByGoogle = await prisma.user.findFirst({ where: { googleId } })
  if (existingByGoogle) {
    await createSession(existingByGoogle.id)
    return NextResponse.redirect(new URL('/dashboard', getAppBaseUrl(request)))
  }

  const existingByEmail = await prisma.user.findUnique({ where: { email } })
  if (existingByEmail) {
    await prisma.user.update({ where: { id: existingByEmail.id }, data: { googleId } })
    await createSession(existingByEmail.id)
    return NextResponse.redirect(new URL('/dashboard', getAppBaseUrl(request)))
  }

  const user = await prisma.user.create({
    data: {
      email,
      googleId,
      fullName,
      phoneNumber: null,
      telegramId: null,
      passwordHash: hashPassword(randomBytes(32).toString('hex')),
    },
  })

  await createSession(user.id)
  return NextResponse.redirect(new URL('/dashboard', getAppBaseUrl(request)))
}
