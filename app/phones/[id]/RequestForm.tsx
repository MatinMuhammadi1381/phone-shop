'use client'

import { useState } from 'react'

type DefaultValues = {
  fullName: string
  phoneNumber: string
  telegramId: string
}

export default function RequestForm({
  phoneId,
  defaultValues,
}: {
  phoneId: number
  defaultValues?: DefaultValues
}) {
  const [form, setForm] = useState({
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneId,
          message: form.message,
        }),
      })

      if (res.ok) {
        setMessage({ text: 'درخواست شما ثبت شد، به زودی با شما تماس میگیریم ✅', ok: true })
        setForm({ message: '' })
      } else {
        const data = await res.json().catch(() => null)
        setMessage({ text: data?.error ?? 'خطا در ثبت درخواست ❌', ok: false })
      }
    } catch {
      setMessage({ text: 'خطا در اتصال به سرور ❌', ok: false })
    }
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: 'var(--text-primary)',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
  }

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <div style={{ width: '4px', height: '16px', background: '#8ab4f8', borderRadius: '2px' }} />
        <h2 style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 600 }}>درخواست خرید</h2>
      </div>

      <div style={{ gap: '14px' }}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '6px', display: 'block' }}>پیام برای ادمین (اختیاری)</label>
          <textarea name="message" value={form.message} onChange={handleChange} placeholder="سوال یا توضیح اضافه..." rows={4} style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }} />
        </div>
      </div>

      {message && (
        <div style={{
          marginTop: '14px', padding: '10px 14px', borderRadius: '8px',
          background: message.ok ? 'rgba(111,227,168,0.1)' : 'rgba(248,113,113,0.1)',
          color: message.ok ? '#6fe3a8' : '#f87171',
          border: `1px solid ${message.ok ? '#6fe3a840' : '#f8717140'}`,
          fontSize: '14px',
        }}>{message.text}</div>
      )}

      <button onClick={handleSubmit} disabled={loading} style={{
        marginTop: '16px', width: '100%',
        background: loading ? 'var(--btn-bg)' : 'var(--btn-active-bg)',
        border: '1px solid var(--btn-active-border)',
        borderRadius: '10px', color: loading ? 'var(--text-muted)' : 'var(--btn-active-color)',
        fontSize: '15px', fontWeight: 600, padding: '12px',
        cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
        backdropFilter: 'blur(8px)',
      }}>
        {loading ? 'در حال ثبت...' : 'ثبت درخواست خرید'}
      </button>
    </div>
  )
}
