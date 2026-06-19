"use client"

import { useState } from 'react'

export default function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function submit() {
    setMessage(null)
    if (!currentPassword) return setMessage('رمز فعلی را وارد کنید')
    if (!newPassword) return setMessage('رمز جدید را وارد کنید')
    if (newPassword !== confirmPassword) return setMessage('رمز جدید و تکرار آن یکسان نیست')

    setLoading(true)
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage(data?.error || 'خطا در تغییر رمز')
      } else {
        setMessage('رمز عبور با موفقیت تغییر کرد')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setTimeout(() => onClose(), 900)
      }
    } catch (err) {
      setMessage('خطا در ارتباط با سرور')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(8, 15, 28, 0.58)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }} role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background: 'var(--nav-bg)', border: '1px solid var(--nav-border)',
        backdropFilter: 'blur(16px)', borderRadius: '22px', padding: '20px',
        maxWidth: 520, width: '100%', boxShadow: '0 12px 34px rgba(0,0,0,0.28)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h3 style={{ margin: 0 }}>تغییر رمز عبور</h3>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>برای تغییر رمز، ابتدا رمز فعلی را وارد کنید.</div>
          </div>
          <button className="btn" onClick={onClose}>بستن</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label>
            رمز فعلی
            <input type="password" className="input" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </label>
          <label>
            رمز جدید
            <input type="password" className="input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </label>
          <label>
            تکرار رمز جدید
            <input type="password" className="input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </label>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button type="button" className="btn primary" disabled={loading} onClick={submit}>{loading ? 'در حال تغییر...' : 'تغییر رمز'}</button>
            <button type="button" className="btn" onClick={onClose}>انصراف</button>
            {message && <div style={{ color: '#fff' }}>{message}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
