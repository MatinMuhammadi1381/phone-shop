import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: Request) {
  const body = await request.json()
  const { phoneId, message } = body
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: 'برای ثبت درخواست باید وارد شوید' }, { status: 401 })
  }

  if (!phoneId || !user.fullName || !user.phoneNumber) {
    return NextResponse.json(
      { error: 'اطلاعات تماس شما ناقص است' },
      { status: 400 }
    )
  }

  const purchaseRequest = await prisma.purchaseRequest.create({
    data: {
      phoneId,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      telegramId: user.telegramId ?? '',
      message: message ?? '',
      userId: user.id,
    },
  })

  return NextResponse.json(purchaseRequest, { status: 201 })
}

export async function GET() {
  const { requireAdmin } = await import('@/lib/admin-auth')
  const guard = await requireAdmin()
  if (guard) return guard
  const requests = await prisma.purchaseRequest.findMany({
    include: { phone: true },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(requests)
}