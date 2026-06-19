import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET() {
  const guard = await requireAdmin()
  if (guard) return guard

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      fullName: true,
      phoneNumber: true,
      email: true,
      telegramId: true,
      createdAt: true,
    },
  })

  const dailyStats: { date: string; count: number }[] = []
  const dayMap = new Map<string, number>()

  for (let i = 0; i < 30; i++) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const key = d.toISOString().slice(0, 10)
    dayMap.set(key, 0)
  }

  for (const u of users) {
    const key = u.createdAt.toISOString().slice(0, 10)
    if (dayMap.has(key)) dayMap.set(key, (dayMap.get(key) || 0) + 1)
  }

  const sorted = [...dayMap.entries()].sort(([a], [b]) => a.localeCompare(b))
  for (const [date, count] of sorted) {
    dailyStats.push({ date, count })
  }

  return NextResponse.json({ dailyStats, users })
}