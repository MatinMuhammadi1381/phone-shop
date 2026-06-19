'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function CategoryTransition({ children }: { children: React.ReactNode }) {
  const params = useSearchParams()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const key = params.toString()
    if (!key) return
    el.classList.remove('refiltering')
    requestAnimationFrame(() => {
      el.classList.add('refiltering')
      setTimeout(() => el?.classList.remove('refiltering'), 200)
    })
  }, [params])

  return <div ref={ref} style={{ transition: 'opacity 0.15s ease, transform 0.15s ease' }}>{children}</div>
}