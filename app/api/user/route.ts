import { NextResponse } from 'next/server'
import { getCurrentUser, hashPassword } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { fullName, email, telegramId, password } = body as { fullName?: string; email?: string | null; telegramId?: string | null; password?: string }

  const data: any = {}
  if (typeof fullName === 'string') data.fullName = fullName
  if (typeof email === 'string' || email === null) data.email = email
  if (typeof telegramId === 'string' || telegramId === null) data.telegramId = telegramId
  if (typeof password === 'string' && password.length > 0) data.passwordHash = hashPassword(password)

  try {
    const updated = await prisma.user.update({ where: { id: user.id }, data })
    return NextResponse.json({ ok: true, user: { id: updated.id, fullName: updated.fullName, email: updated.email, telegramId: updated.telegramId } })
  } catch (err: any) {
    // handle unique constraint errors
    const msg = err?.meta?.target ? `Conflicting value for ${err.meta.target}` : 'Update failed'
    return NextResponse.json({ error: String(msg) }, { status: 400 })
  }
}
