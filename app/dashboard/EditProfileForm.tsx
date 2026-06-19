"use client"

import { useState } from 'react'
import ChangePasswordModal from './ChangePasswordModal'

export default function EditProfileForm({ user }: { user: { fullName: string; email?: string | null; telegramId?: string | null } }) {
  const [fullName, setFullName] = useState(user.fullName || '')
  const [email, setEmail] = useState(user.email ?? '')
  const [telegramId, setTelegramId] = useState(user.telegramId ?? '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [showChangePassword, setShowChangePassword] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    // password change handled in separate modal
    setLoading(true)
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: fullName.trim(), email: email.trim() || null, telegramId: telegramId.trim() || null }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setMessage(data?.error || 'خطا در به‌روزرسانی پروفایل')
      } else {
        setMessage('پروفایل با موفقیت بروزرسانی شد')
      }
    } catch (err) {
      setMessage('خطا در ارتباط با سرور')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} style={{ ...{ display: 'flex', flexDirection: 'column', gap: 8 } } }>
      <label>
        نام کامل
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" />
      </label>

      <label>
        ایمیل (اختیاری)
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
      </label>

      <label>
        آیدی تلگرام (اختیاری)
        <input value={telegramId} onChange={(e) => setTelegramId(e.target.value)} className="input" />
      </label>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button type="submit" className="btn" disabled={loading}>{loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}</button>
        <button type="button" className="btn secondary" onClick={() => setShowChangePassword(true)}>تغییر رمز عبور</button>
        {message && <div style={{ color: '#fff' }}>{message}</div>}
      </div>

      {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}
    </form>
  )
}
