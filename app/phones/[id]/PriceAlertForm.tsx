'use client'

import { useState } from 'react'

export default function PriceAlertForm({ phoneId, isLoggedIn, currentPrice }: { phoneId: number; isLoggedIn: boolean; currentPrice: number }) {
  const [targetPrice, setTargetPrice] = useState(currentPrice > 0 ? String(Math.round(currentPrice * 0.85)) : '')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    const res = await fetch('/api/price-alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneId, targetPrice: Number(targetPrice), phoneNumber: phoneNumber || undefined }),
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok) {
      setMessage({ text: 'هشدار قیمت ثبت شد ✅ در صورت کاهش قیمت به شما اطلاع داده می‌شود', ok: true })
    } else {
      setMessage({ text: data.error ?? 'خطا', ok: false })
    }
    setLoading(false)
  }

  if (!isLoggedIn) return null

  return (
    <div>
      <button
        type="button"
        onClick={() => setShowForm(!showForm)}
        style={{
          width: '100%', background: 'var(--btn-bg)', border: '1px solid var(--btn-border)',
          borderRadius: '12px', padding: '12px', cursor: 'pointer', fontFamily: 'inherit',
          color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}
      >
        🔔 {showForm ? 'بستن' : 'هشدار کاهش قیمت'}
      </button>

      {showForm && (
        <form onSubmit={submit} style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
          <div>
            <label style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '4px', display: 'block' }}>
              قیمت مورد نظر (تومان)
            </label>
            <input
              type="number" value={targetPrice}
              onChange={e => setTargetPrice(e.target.value)}
              required
              style={{
                width: '100%', background: 'var(--input-bg)', border: '1px solid var(--input-border)',
                borderRadius: '8px', padding: '10px 12px', color: 'var(--text-primary)',
                fontSize: '14px', fontFamily: 'inherit', outline: 'none',
              }}
            />
          </div>
          <div>
            <label style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '4px', display: 'block' }}>
              شماره تماس (برای اطلاع)
            </label>
            <input
              type="text" value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              placeholder="09xxxxxxxxx"
              style={{
                width: '100%', background: 'var(--input-bg)', border: '1px solid var(--input-border)',
                borderRadius: '8px', padding: '10px 12px', color: 'var(--text-primary)',
                fontSize: '14px', fontFamily: 'inherit', outline: 'none',
              }}
            />
          </div>
          <button
            disabled={loading}
            style={{
              background: loading ? 'var(--btn-bg)' : '#f97316', border: 'none',
              borderRadius: '10px', padding: '11px', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', fontWeight: 600, fontSize: '14px', color: '#fff',
            }}
          >
            {loading ? 'در حال ثبت...' : 'ثبت هشدار'}
          </button>
          {message && (
            <div style={{
              padding: '8px 12px', borderRadius: '8px', fontSize: '13px',
              background: message.ok ? 'rgba(111,227,168,0.1)' : 'rgba(248,113,113,0.1)',
              color: message.ok ? '#6fe3a8' : '#f87171',
              border: `1px solid ${message.ok ? '#6fe3a840' : '#f8717140'}`,
            }}>
              {message.text}
            </div>
          )}
        </form>
      )}
    </div>
  )
}
