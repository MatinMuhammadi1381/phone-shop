import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET() {
  const guard = await requireAdmin()
  if (guard) return guard

  const now = new Date()

  const activeSessions = await prisma.session.count({
    where: { expiresAt: { gt: now } },
  })

  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const recentSessions = await prisma.session.findMany({
    where: { createdAt: { gte: twentyFourHoursAgo } },
    select: { createdAt: true },
  })

  const hourMap = new Map<string, number>()
  for (let i = 0; i < 24; i++) {
    const d = new Date(now.getTime() - i * 60 * 60 * 1000)
    const key = d.toISOString().slice(0, 13)
    hourMap.set(key, 0)
  }

  for (const s of recentSessions) {
    const key = s.createdAt.toISOString().slice(0, 13)
    if (hourMap.has(key)) hourMap.set(key, (hourMap.get(key) || 0) + 1)
  }

  const hourlyStats = [...hourMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([hour, count]) => ({ hour, count }))

  const activeUsers = await prisma.session.findMany({
    where: { expiresAt: { gt: now } },
    select: { userId: true },
    distinct: ['userId'],
  })

  return NextResponse.json({
    currentOnline: activeUsers.length,
    currentSessions: activeSessions,
    hourlyStats,
  })
}