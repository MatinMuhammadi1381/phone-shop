'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'

type PhoneMode = 'login' | 'signup'
type FlowMode = 'phone' | 'google'

export default function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [flow, setFlow] = useState<FlowMode>('google')
  const [phoneMode, setPhoneMode] = useState<PhoneMode>('signup')
  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    telegramId: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''
  const isGoogleConfigured = googleClientId.length > 20 && !/your[-_]?google|your[-_]?client/i.test(googleClientId)
  const authError = searchParams.get('error')

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    borderRadius: '8px',
    padding: '11px 12px',
    color: 'var(--text-primary)',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
  }

  const labelStyle: React.CSSProperties = {
    color: 'var(--text-secondary)',
    fontSize: '13px',
    marginBottom: '6px',
    display: 'block',
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const resetMessage = () => setMessage(null)

  const submitPhoneAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const endpoint = phoneMode === 'signup' ? '/api/auth/signup' : '/api/auth/login'
    const payload = phoneMode === 'signup'
      ? {
          fullName: form.fullName,
          phoneNumber: form.phoneNumber,
          telegramId: form.telegramId,
          password: form.password,
        }
      : { phoneNumber: form.phoneNumber, password: form.password }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json().catch(() => ({}))
    if (res.ok) {
      setMessage({ text: 'ورود موفق بود', ok: true })
      router.push('/dashboard')
      router.refresh()
    } else {
      setMessage({ text: data.error ?? 'خطا در ثبت اطلاعات', ok: false })
    }

    setLoading(false)
  }

  const cardStyle: React.CSSProperties = {
    maxWidth: '460px',
    margin: '0 auto',
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    borderRadius: '16px',
    padding: '24px',
    backdropFilter: 'blur(10px)',
  }

  const googleButtonStyle = useMemo<React.CSSProperties>(() => ({
    width: '100%',
    borderRadius: '12px',
    padding: '12px 14px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: 700,
    border: '1px solid var(--google-btn-border)',
    background: 'var(--google-btn-bg)',
    color: 'var(--google-btn-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  }), [])

  return (
    <div style={cardStyle}>
      <div style={{ display: 'grid', gap: '10px', marginBottom: '18px' }}>
        <button
          type="button"
          disabled={!isGoogleConfigured}
          onClick={() => {
            setFlow('google')
            resetMessage()
            if (isGoogleConfigured) {
              window.location.href = '/api/auth/google'
            }
          }}
          style={{
            ...googleButtonStyle,
            background: 'var(--google-btn-bg)',
            borderColor: 'var(--google-btn-border)',
            cursor: isGoogleConfigured ? 'pointer' : 'not-allowed',
            opacity: isGoogleConfigured ? 1 : 0.55,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.6-.05-1.17-.15-1.72H9v3.26h4.84c-.21 1.13-.84 2.09-1.8 2.74v2.28h2.92c1.7-1.57 2.68-3.87 2.68-6.56z" fill="#4285F4" />
            <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.28c-.81.55-1.84.88-3.04.88-2.34 0-4.32-1.58-5.03-3.73H.94v2.34C2.43 15.95 5.48 18 9 18z" fill="#34A853" />
            <path d="M3.97 10.7c-.18-.55-.28-1.14-.28-1.74s.1-1.19.28-1.74V4.88H.94A8.98 8.98 0 0 0 0 9c0 1.47.35 2.86.94 4.12l3.03-2.42z" fill="#FBBC05" />
            <path d="M9 3.58c1.32 0 2.5.45 3.43 1.33l2.57-2.57C13.46.99 11.42 0 9 0 5.48 0 2.43 2.05.94 4.88l3.03 2.34C4.68 5.16 6.66 3.58 9 3.58z" fill="#EA4335" />
          </svg>
          ادامه با گوگل
        </button>

        <div className="responsive-two-col" style={{ gap: '8px' }}>
          {[
            { value: 'signup', label: 'ثبت‌نام با شماره' },
            { value: 'login', label: 'ورود با شماره' },
          ].map(item => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                setFlow('phone')
                setPhoneMode(item.value as PhoneMode)
                resetMessage()
              }}
              style={{
                background: flow === 'phone' && phoneMode === item.value ? 'var(--btn-active-bg)' : 'var(--btn-bg)',
                border: flow === 'phone' && phoneMode === item.value ? '1px solid var(--btn-active-border)' : '1px solid var(--btn-border)',
                color: flow === 'phone' && phoneMode === item.value ? 'var(--btn-active-color)' : 'var(--btn-color)',
                borderRadius: '10px',
                padding: '10px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '14px',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {flow === 'google' ? (
        <div style={{ display: 'grid', gap: '14px' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
            برای ورود یا ثبت‌نام با حساب Google روی دکمه بالا کلیک کنید. پس از تایید گوگل، به داشبورد منتقل می‌شوید.
          </div>

          {(authError || message) && (
            <div
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                background: (message?.ok ?? false) ? 'rgba(111,227,168,0.1)' : 'rgba(248,113,113,0.1)',
                color: (message?.ok ?? false) ? '#6fe3a8' : '#f87171',
                border: `1px solid ${(message?.ok ?? false) ? '#6fe3a840' : '#f8717140'}`,
                fontSize: '13px',
              }}
            >
              {authError ?? message?.text}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={submitPhoneAuth} style={{ display: 'grid', gap: '14px' }}>
          {phoneMode === 'signup' && (
            <>
              <div>
                <label style={labelStyle}>نام و نام خانوادگی</label>
                <input name="fullName" value={form.fullName} onChange={handleChange} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>آیدی تلگرام</label>
                <input name="telegramId" value={form.telegramId} onChange={handleChange} placeholder="@username" style={inputStyle} />
              </div>
            </>
          )}
          <div>
            <label style={labelStyle}>شماره تماس</label>
            <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="09xxxxxxxxx" style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>رمز عبور</label>
            <input name="password" value={form.password} onChange={handleChange} type="password" minLength={6} style={inputStyle} required />
          </div>

          {message && (
            <div
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                background: message.ok ? 'rgba(111,227,168,0.1)' : 'rgba(248,113,113,0.1)',
                color: message.ok ? '#6fe3a8' : '#f87171',
                border: `1px solid ${message.ok ? '#6fe3a840' : '#f8717140'}`,
                fontSize: '13px',
              }}
            >
              {message.text}
            </div>
          )}

          <button
            disabled={loading}
            style={{
              background: loading ? 'var(--btn-bg)' : 'var(--btn-active-bg)',
              border: '1px solid var(--btn-active-border)',
              color: loading ? 'var(--text-muted)' : 'var(--text-primary)',
              borderRadius: '10px',
              padding: '13px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              fontWeight: 700,
              fontSize: '15px',
            }}
          >
            {loading ? 'در حال انجام...' : phoneMode === 'signup' ? 'ساخت حساب' : 'ورود به حساب'}
          </button>
        </form>
      )}

      <Link
        href="/"
        style={{
          display: 'block',
          textAlign: 'center',
          marginTop: '16px',
          color: 'var(--text-secondary)',
          fontSize: '13px',
        }}
      >
        بازگشت به فروشگاه
      </Link>
    </div>
  )
}
