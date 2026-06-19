'use client'

import { FormEvent, useState } from 'react'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'خطا در ورود')
        setLoading(false)
        return
      }
      window.location.href = '/admin'
    } catch {
      setError('خطا در ارتباط با سرور')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', background: 'var(--bg-main)',
    }}>
      <form onSubmit={handleSubmit} className="liquid-glass" style={{
        width: '100%', maxWidth: '380px', padding: '32px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔐</div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: 700 }}>ورود ادمین</h1>
        </div>

        {error && (
          <div style={{
            color: '#ef4444', fontSize: '13px', marginBottom: '16px',
            padding: '10px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        <input
          type="text" value={username} onChange={e => setUsername(e.target.value)}
          placeholder="نام کاربری" required
          className="input" style={{ marginBottom: '12px' }}
          autoComplete="username"
        />
        <input
          type="password" value={password} onChange={e => setPassword(e.target.value)}
          placeholder="رمز عبور" required
          className="input" style={{ marginBottom: '20px' }}
          autoComplete="current-password"
        />
        <button type="submit" disabled={loading} className="btn primary" style={{
          width: '100%', padding: '12px', fontSize: '15px', fontWeight: 600,
        }}>
          {loading ? 'در حال بررسی...' : 'ورود به پنل مدیریت'}
        </button>
      </form>
    </div>
  )
}