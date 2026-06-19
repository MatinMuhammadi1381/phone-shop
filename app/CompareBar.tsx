'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'tmobile_compare_ids'

export function getCompareIds(): number[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function addCompareId(id: number) {
  const ids = getCompareIds()
  if (!ids.includes(id)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids, id]))
    window.dispatchEvent(new Event('compare-change'))
  }
}

export function removeCompareId(id: number) {
  const ids = getCompareIds().filter(x => x !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  window.dispatchEvent(new Event('compare-change'))
}

export function isCompareId(id: number): boolean {
  return getCompareIds().includes(id)
}

export function clearCompareIds() {
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event('compare-change'))
}

export default function CompareBar() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const update = () => setCount(getCompareIds().length)
    update()
    window.addEventListener('compare-change', update)
    return () => window.removeEventListener('compare-change', update)
  }, [])

  if (count === 0) return null

  return (
    <div style={{
      position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
      zIndex: 500, background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      backdropFilter: 'blur(16px)', borderRadius: '16px',
      padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    }}>
      <span style={{ color: 'var(--text-primary)', fontSize: '14px' }}>
        {count} گوشی انتخاب شده
      </span>
      <Link
        href="/compare"
        style={{
          background: 'var(--btn-active-bg)', border: '1px solid var(--btn-active-border)',
          color: 'var(--btn-active-color)', borderRadius: '10px', padding: '8px 16px',
          fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        مقایسه کن
      </Link>
      <button
        type="button"
        onClick={clearCompareIds}
        style={{
          background: 'none', border: '1px solid var(--btn-border)',
          color: 'var(--text-secondary)', borderRadius: '10px', padding: '8px 12px',
          fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        پاک کن
      </button>
    </div>
  )
}
