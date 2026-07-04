import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { parsePhoneBody } from '@/lib/phones'


export async function GET() {
  const phones = await prisma.phone.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(phones)
}


export async function POST(request: Request) {
  const guard = await requireAdmin()
  if (guard) return guard

  const parsed = parsePhoneBody(await request.json())
  if ('error' in parsed) return parsed.error

  // brand & model are the only required fields for a usable listing
  if (!parsed.data.brand || !parsed.data.model) {
    return NextResponse.json({ error: 'برند و مدل الزامی است' }, { status: 400 })
  }

  const { brand, model } = parsed.data
  const phone = await prisma.phone.create({
    data: { ...parsed.data, brand, model },
  })
  return NextResponse.json(phone, { status: 201 })
}