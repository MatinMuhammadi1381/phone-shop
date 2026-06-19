import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'برای دیدن علاقه‌مندی‌ها وارد حساب شوید' }, { status: 401 })
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: { phone: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(favorites)
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'برای ذخیره گوشی وارد حساب شوید' }, { status: 401 })
  }

  const body = await request.json()
  const phoneId = Number(body.phoneId)

  if (!phoneId) {
    return NextResponse.json({ error: 'شناسه گوشی معتبر نیست' }, { status: 400 })
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_phoneId: { userId: user.id, phoneId } },
  })

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } })
    return NextResponse.json({ saved: false })
  }

  await prisma.favorite.create({
    data: { userId: user.id, phoneId },
  })

  return NextResponse.json({ saved: true })
}
