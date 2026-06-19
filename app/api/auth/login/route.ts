import { NextResponse } from 'next/server'
import { createSession, verifyPassword } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export async function POST(request: Request) {
  const body = await request.json()
  const phoneNumber = clean(body.phoneNumber)
  const password = clean(body.password)

  if (!phoneNumber || !password) {
    return NextResponse.json({ error: 'شماره تماس و رمز را وارد کنید' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { phoneNumber } })
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: 'شماره تماس یا رمز اشتباه است' }, { status: 401 })
  }

  await createSession(user.id)

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      telegramId: user.telegramId,
    },
  })
}
