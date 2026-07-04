import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { parsePhoneBody } from '@/lib/phones'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const phone = await prisma.phone.findUnique({
    where: { id: Number(id) },
    include: { requests: true }
  })
  if (!phone) return NextResponse.json({ error: 'پیدا نشد' }, { status: 404 })

  await prisma.phone.update({
    where: { id: Number(id) },
    data: { views: { increment: 1 } },
  })

  return NextResponse.json(phone)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin()
  if (guard) return guard
  const { id } = await params

  const parsed = parsePhoneBody(await request.json())
  if ('error' in parsed) return parsed.error

  const phone = await prisma.phone.update({
    where: { id: Number(id) },
    data: parsed.data,
  })
  return NextResponse.json(phone)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin()
  if (guard) return guard
  const { id } = await params
  await prisma.phone.delete({
    where: { id: Number(id) }
  })
  return NextResponse.json({ message: 'حذف شد' })
}