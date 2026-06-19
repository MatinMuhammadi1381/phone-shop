'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LogoutButton({ compact }: { compact?: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const logout = async () => {
    setLoading(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  if (compact) {
    return (
      <button onClick={logout} disabled={loading} style={{
        width: '100%', display: 'block', padding: '10px 12px', borderRadius: '10px',
        border: 'none', background: 'transparent', cursor: loading ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit', fontSize: '14px', color: '#f87171', textAlign: 'right',
        transition: 'background 0.15s',
      }}
        onMouseOver={e => e.currentTarget.style.background = 'rgba(248,113,113,0.08)'}
        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
      >
        {loading ? '...' : '🚪 خروج'}
      </button>
    )
  }

  return (
    <button onClick={logout} disabled={loading} style={{
      color: loading ? 'var(--text-muted)' : '#f87171',
      fontSize: '13px',
      cursor: loading ? 'not-allowed' : 'pointer',
      padding: '8px 14px',
      borderRadius: '8px',
      background: 'rgba(248,113,113,0.08)',
      border: '1px solid rgba(248,113,113,0.25)',
      fontFamily: 'inherit',
    }}>
      {loading ? '...' : 'خروج'}
    </button>
  )
}
