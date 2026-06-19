import { NextResponse } from 'next/server'
import { getCurrentUser, verifyPassword, hashPassword } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { currentPassword, newPassword } = body as { currentPassword?: string; newPassword?: string }
  if (!currentPassword || !newPassword) return NextResponse.json({ error: 'missing_fields' }, { status: 400 })

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  if (!dbUser) return NextResponse.json({ error: 'user_not_found' }, { status: 404 })

  const ok = verifyPassword(currentPassword, dbUser.passwordHash)
  if (!ok) return NextResponse.json({ error: 'invalid_current_password' }, { status: 403 })

  const newHash = hashPassword(newPassword)
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: newHash } })

  return NextResponse.json({ ok: true })
}
