import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ثبت درخواست خرید
export async function POST(request: Request) {
  const body = await request.json()
  const { phoneId, fullName, phoneNumber, message } = body

  if (!phoneId || !fullName || !phoneNumber) {
    return NextResponse.json(
      { error: 'اطلاعات ناقص است' },
      { status: 400 }
    )
  }

  const purchaseRequest = await prisma.purchaseRequest.create({
    data: { phoneId, fullName, phoneNumber, message }
  })

  return NextResponse.json(purchaseRequest, { status: 201 })
}

// گرفتن همه درخواست‌ها (برای پنل ادمین)
export async function GET() {
  const requests = await prisma.purchaseRequest.findMany({
    include: { phone: true },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(requests)
}