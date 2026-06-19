import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'لطفاً ابتدا وارد شوید' }, { status: 401 })
  }

  const body = await request.json()
  const { phoneId } = body

  if (!phoneId) {
    return NextResponse.json({ error: 'phoneId required' }, { status: 400 })
  }

  await prisma.viewHistory.create({
    data: {
      phoneId: Number(phoneId),
      userId: user.id,
    },
  })

  return NextResponse.json({ success: true })
}

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'لطفاً ابتدا وارد شوید' }, { status: 401 })
  }

  const history = await prisma.viewHistory.findMany({
    where: { userId: user.id },
    orderBy: { viewedAt: 'desc' },
    take: 20,
    distinct: ['phoneId'],
    include: {
      phone: {
        select: {
          id: true,
          brand: true,
          model: true,
          price: true,
          images: true,
          storage: true,
          ram: true,
          section: true,
        },
      },
    },
  })

  return NextResponse.json(history)
}
