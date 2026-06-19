import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const phoneId = url.searchParams.get('phoneId')
  if (!phoneId) {
    return NextResponse.json({ error: 'phoneId required' }, { status: 400 })
  }

  const reviews = await prisma.review.findMany({
    where: { phoneId: Number(phoneId) },
    include: {
      user: { select: { id: true, fullName: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(reviews)
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'لطفاً ابتدا وارد شوید' }, { status: 401 })
  }

  const body = await request.json()
  const { phoneId, rating, comment } = body

  if (!phoneId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'امتیاز معتبر نیست' }, { status: 400 })
  }

  const existing = await prisma.review.findUnique({
    where: { userId_phoneId: { userId: user.id, phoneId: Number(phoneId) } },
  })
  if (existing) {
    return NextResponse.json({ error: 'شما قبلاً برای این گوشی نظر داده‌اید' }, { status: 409 })
  }

  const review = await prisma.review.create({
    data: {
      phoneId: Number(phoneId),
      userId: user.id,
      rating: Number(rating),
      comment: comment || null,
    },
    include: {
      user: { select: { id: true, fullName: true } },
    },
  })

  return NextResponse.json(review, { status: 201 })
}
