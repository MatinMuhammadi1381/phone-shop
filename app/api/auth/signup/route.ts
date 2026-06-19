import { NextResponse } from 'next/server'
import { createSession, hashPassword } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export async function POST(request: Request) {
  const body = await request.json()
  const fullName = clean(body.fullName)
  const phoneNumber = clean(body.phoneNumber)
  const telegramId = clean(body.telegramId) || null
  const password = clean(body.password)

  if (fullName.length < 3 || phoneNumber.length < 8 || password.length < 6) {
    return NextResponse.json(
      { error: 'نام، شماره تماس و رمز حداقل ۶ کاراکتر را کامل وارد کنید' },
      { status: 400 }
    )
  }

  const existing = await prisma.user.findUnique({ where: { phoneNumber } })
  if (existing) {
    return NextResponse.json(
      { error: 'این شماره تماس قبلاً ثبت‌نام شده است' },
      { status: 409 }
    )
  }

  const user = await prisma.user.create({
    data: {
      fullName,
      phoneNumber,
      telegramId,
      passwordHash: hashPassword(password),
    },
    select: { id: true, email: true, fullName: true, phoneNumber: true, telegramId: true },
  })

  await createSession(user.id)
  return NextResponse.json({ user }, { status: 201 })
}
