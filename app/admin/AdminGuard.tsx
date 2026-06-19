'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ok, setOk] = useState(false)

  useEffect(() => {
    fetch('/api/auth/admin-check')
      .then(r => { if (r.ok) setOk(true); else router.replace('/admin-login') })
      .catch(() => router.replace('/admin-login'))
  }, [router])

  if (!ok) return null
  return <>{children}</>
}