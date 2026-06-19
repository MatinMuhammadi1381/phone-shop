import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'لطفاً ابتدا وارد شوید' }, { status: 401 })
  }

  const body = await request.json()
  const { phoneId, phoneNumber, targetPrice } = body

  if (!phoneId || !targetPrice) {
    return NextResponse.json({ error: 'اطلاعات ناقص است' }, { status: 400 })
  }

  const alert = await prisma.priceAlert.create({
    data: {
      phoneId: Number(phoneId),
      userId: user.id,
      phoneNumber: phoneNumber || user.phoneNumber || null,
      targetPrice: Number(targetPrice),
    },
  })

  return NextResponse.json(alert, { status: 201 })
}

export async function GET() {
  return NextResponse.json({ message: 'ok' })
}
