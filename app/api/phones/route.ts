import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'


export async function GET() {
  const phones = await prisma.phone.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(phones)
}


export async function POST(request: Request) {
  const guard = await requireAdmin()
  if (guard) return guard
  const body = await request.json()
  const phone = await prisma.phone.create({
    data: body
  })
  return NextResponse.json(phone, { status: 201 })
}