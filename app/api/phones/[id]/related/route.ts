import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const phone = await prisma.phone.findUnique({ where: { id: Number(id) } })

  if (!phone) {
    return NextResponse.json({ error: 'پیدا نشد' }, { status: 404 })
  }

  const sameBrand = await prisma.phone.findMany({
    where: { brand: { equals: phone.brand, mode: 'insensitive' }, id: { not: phone.id }, isSold: false },
    take: 6,
  })
  const related = sameBrand.slice(0, 6)

  if (related.length < 3) {
    const other = await prisma.phone.findMany({
      where: { brand: { not: phone.brand }, id: { not: phone.id }, isSold: false },
      take: 6 - related.length,
    })
    related.push(...other)
  }

  return NextResponse.json(related)
}
