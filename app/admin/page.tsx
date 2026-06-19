/* eslint-disable react-hooks/set-state-in-effect */
 
/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect } from 'react'
import AdminGuard from './AdminGuard'

type DailyStat = { date: string; count: number }
type HourlyStat = { hour: string; count: number }
type RegUser = { id: number; fullName: string; phoneNumber: string | null; email: string | null; telegramId: string | null; createdAt: string }

type Phone = {
  id: number
  brand: string
  model: string
  price: number
  storage: string
  ram: string
  color: string
  condition: string
  description: string
  images: string[]
  isSold: boolean
  views: number
  section: string | null
  createdAt: string
}

type Request = {
  id: number
  fullName: string
  phoneNumber: string
  telegramId: string
  message: string
  createdAt: string
  phone: Phone
}

type Stats = {
  total: number
  sold: number
  available: number
  requests: number
  views: number
}

const conditions = [
  { value: 'like_new', label: 'مثل نو' },
  { value: 'good', label: 'خوب' },
  { value: 'fair', label: 'قابل قبول' },
]

const sections = [
  { value: '', label: 'بدون بخش خاص' },
  { value: 'featured', label: '⭐ پیشنهادی' },
  { value: 'budget', label: '💰 قیمت مناسب' },
  { value: 'new_box', label: '📦 اکبند' },
]

const initialForm = {
  brand: '', model: '', price: '', storage: '',
  ram: '', color: '', condition: 'like_new', description: '', section: '',
}

const sectionBadge: Record<string, { label: string; bg: string; color: string }> = {
  featured: { label: '⭐ پیشنهادی', bg: 'rgba(249, 116, 22, 0.29)', color: '#f97316' },
  budget: { label: '💰 قیمت مناسب', bg: 'rgba(34, 197, 94, 0.29)', color: '#22c55e' },
  new_box: { label: '📦 اکبند', bg: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' },
}

export default function AdminPage() {
  const [tab, setTab] = useState<'dashboard' | 'phones' | 'requests' | 'add' | 'registrations' | 'online'>('dashboard')
  const [phones, setPhones] = useState<Phone[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [form, setForm] = useState(initialForm)
  const [editPhone, setEditPhone] = useState<Phone | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)
  const [regDailyStats, setRegDailyStats] = useState<DailyStat[]>([])
  const [regUsers, setRegUsers] = useState<RegUser[]>([])
  const [currentOnline, setCurrentOnline] = useState(0)
  const [hourlyStats, setHourlyStats] = useState<HourlyStat[]>([])

  const fetchAll = async () => {
    const [phonesRes, requestsRes] = await Promise.all([
      fetch('/api/phones'),
      fetch('/api/requests'),
    ])
    const phonesData: Phone[] = await phonesRes.json()
    const requestsData: Request[] = await requestsRes.json()
    setPhones(phonesData)
    setRequests(requestsData)
    setStats({
      total: phonesData.length,
      sold: phonesData.filter(p => p.isSold).length,
      available: phonesData.filter(p => !p.isSold).length,
      requests: requestsData.length,
      views: phonesData.reduce((a, p) => a + (p.views ?? 0), 0),
    })
  }

  const fetchRegistrations = async () => {
    try {
      const res = await fetch('/api/admin/stats/registrations')
      if (res.ok) {
        const data = await res.json()
        setRegDailyStats(data.dailyStats)
        setRegUsers(data.users)
      }
    } catch { }
  }

  const fetchOnline = async () => {
    try {
      const res = await fetch('/api/admin/stats/online')
      if (res.ok) {
        const data = await res.json()
        setCurrentOnline(data.currentOnline)
        setHourlyStats(data.hourlyStats)
      }
    } catch { }
  }

  useEffect(() => {
    void fetchAll()
  }, [])

  useEffect(() => {
    if (tab === 'registrations') void fetchRegistrations()
    if (tab === 'online') void fetchOnline()
  }, [tab])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    const uploaded: string[] = []
    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      try {
        const data = await res.json()
        if (data.url) uploaded.push(data.url)
      } catch { }
    }
    setImages(prev => [...prev, ...uploaded])
    setUploading(false)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setMessage(null)
    try {
      const url = editPhone ? `/api/phones/${editPhone.id}` : '/api/phones'
      const method = editPhone ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: form.section === 'new_box' ? 0 : Number(form.price),
          condition: form.section === 'new_box' ? 'like_new' : form.condition,
          images,
        }),
      })
      if (res.ok) {
        setMessage({ text: editPhone ? 'گوشی ویرایش شد ✅' : 'گوشی اضافه شد ✅', ok: true })
        setForm(initialForm)
        setImages([])
        setEditPhone(null)
        fetchAll()
        setTimeout(() => setTab('phones'), 1000)
      } else {
        setMessage({ text: 'خطا ❌', ok: false })
      }
    } catch {
      setMessage({ text: 'خطا در اتصال ❌', ok: false })
    }
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('مطمئنی؟')) return
    await fetch(`/api/phones/${id}`, { method: 'DELETE' })
    fetchAll()
  }

  const handleToggleSold = async (phone: Phone) => {
    await fetch(`/api/phones/${phone.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isSold: !phone.isSold }),
    })
    fetchAll()
  }

  const handleEdit = (phone: Phone) => {
    setEditPhone(phone)
    setForm({
      brand: phone.brand, model: phone.model, price: String(phone.price),
      storage: phone.storage, ram: phone.ram, color: phone.color,
      condition: phone.condition, description: phone.description,
      section: phone.section ?? '',
    })
    setImages(phone.images)
    setTab('add')
  }

  function BarChart({ data, labelKey, valueKey, color }: { data: any[]; labelKey: string; valueKey: string; color: string }) {
    const max = Math.max(...data.map(d => d[valueKey]), 1)
    const w = 320
    const h = 160
    const barW = Math.max(8, Math.min(32, (w - data.length * 2) / data.length))
    return (
      <svg viewBox={`0 0 ${w} ${h + 24}`} style={{ width: '100%', maxWidth: `${w}px`, height: `${h + 24}px`, display: 'block', margin: '0 auto' }}>
        {data.map((d, i) => {
          const barH = (d[valueKey] / max) * (h - 8)
          const x = i * (barW + 2) + 2
          const y = h - barH
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={barH} rx="3" fill={color} opacity="0.7">
                <animate attributeName="height" from="0" to={barH} dur="0.4s" begin={`${i * 0.03}s`} />
                <animate attributeName="y" from={h} to={y} dur="0.4s" begin={`${i * 0.03}s`} />
              </rect>
              <text x={x + barW / 2} y={h + 14} textAnchor="middle" fill="var(--text-muted)" fontSize="8">
                {d[labelKey]?.slice?.(-5) ?? d[labelKey]}
              </text>
              <text x={x + barW / 2} y={y - 4} textAnchor="middle" fill="var(--text-secondary)" fontSize="8" fontWeight="600">
                {d[valueKey]}
              </text>
            </g>
          )
        })}
      </svg>
    )
  }

  function formatPersianDate(iso: string) {
    const d = new Date(iso)
    const p = new Intl.DateTimeFormat('fa-IR', { month: 'short', day: 'numeric' }).format(d)
    return p
  }

  function formatPersianDateTime(iso: string) {
    const d = new Date(iso)
    const p = new Intl.DateTimeFormat('fa-IR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d)
    return p
  }

  const glassBox: React.CSSProperties = {
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '14px',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    borderRadius: '8px',
    padding: '10px 12px',
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

  const tabStyle = (t: string): React.CSSProperties => ({
    padding: '8px 18px', borderRadius: '10px',
    border: tab === t ? '1px solid var(--btn-active-border)' : '1px solid var(--btn-border)',
    background: tab === t ? 'var(--btn-active-bg)' : 'var(--btn-bg)',
    color: tab === t ? 'var(--btn-active-color)' : 'var(--btn-color)',
    cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit',
    backdropFilter: 'blur(8px)', transition: 'all 0.2s',
  })

  const actionBtn = (color: string, bg: string): React.CSSProperties => ({
    background: bg, border: `1px solid ${color}22`, borderRadius: '6px',
    color: color, fontSize: '12px', padding: '5px 10px',
    cursor: 'pointer', fontFamily: 'inherit',
  })

  return (
    <AdminGuard>
    <div style={{ minHeight: '100vh', padding: '8px 20px 40px' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <button style={tabStyle('dashboard')} onClick={() => setTab('dashboard')}>داشبورد</button>
          <button style={tabStyle('registrations')} onClick={() => setTab('registrations')}>📋 ثبت‌نامی‌ها</button>
          <button style={tabStyle('online')} onClick={() => setTab('online')}>🟢 آنلاین</button>
          <button style={tabStyle('phones')} onClick={() => setTab('phones')}>گوشی‌ها</button>
          <button style={tabStyle('requests')} onClick={() => setTab('requests')}>درخواست‌ها</button>
          <button style={tabStyle('add')} onClick={() => { setTab('add'); setEditPhone(null); setForm(initialForm); setImages([]) }}>+ افزودن گوشی</button>
        </div>

        {/* داشبورد */}
        {tab === 'dashboard' && stats && (
          <div>
            <div className="responsive-five" style={{ marginBottom: '24px' }}>
              {[
                { label: 'کل گوشی‌ها', value: stats.total, color: 'var(--text-brand)' },
                { label: 'موجود', value: stats.available, color: 'var(--text-price)' },
                { label: 'فروخته شده', value: stats.sold, color: '#fbbf24' },
                { label: 'درخواست‌ها', value: stats.requests, color: '#c084fc' },
                { label: 'کل بازدید', value: stats.views, color: '#f472b6' },
              ].map(s => (
                <div key={s.label} style={{ ...glassBox, padding: '20px', textAlign: 'center' }}>
                  <div style={{ color: s.color, fontSize: '30px', fontWeight: 700 }}>{s.value}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '6px' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={glassBox}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--card-border)', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600 }}>
                پربازدیدترین گوشی‌ها
              </div>
              {[...phones].sort((a, b) => b.views - a.views).slice(0, 5).map((phone, i) => (
                <div key={phone.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 18px', borderBottom: '1px solid var(--card-border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: 'var(--text-brand)', fontSize: '13px', width: '18px' }}>#{i + 1}</span>
                    {phone.images[0] && <img src={phone.images[0]} alt="" style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px' }} />}
                    <span style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{phone.brand} {phone.model}</span>
                  </div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{phone.views} بازدید</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ثبت‌نامی‌ها */}
        {tab === 'registrations' && (
          <div>
            <div style={{ ...glassBox, padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-brand)', fontSize: '13px', marginBottom: '8px' }}>تعداد کل ثبت‌نامی‌ها</div>
              <div style={{ color: '#22c55e', fontSize: '40px', fontWeight: 700 }}>{regUsers.length}</div>
            </div>
            <div style={{ ...glassBox, padding: '20px', marginBottom: '20px' }}>
              <div style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600, marginBottom: '16px', textAlign: 'center' }}>
                ثبت‌نام بر اساس روز (۳۰ روز اخیر)
              </div>
              <BarChart data={regDailyStats} labelKey="date" valueKey="count" color="#22c55e" />
            </div>
            <div style={glassBox}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--card-border)', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600 }}>
                کاربران ثبت‌نام شده ({regUsers.length})
              </div>
              {regUsers.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>کاربری ثبت‌نام نکرده</div>}
              {regUsers.map(u => (
                <div key={u.id} className="admin-phone-row" style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 18px', borderBottom: '1px solid var(--card-border)',
                }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '16px', fontWeight: 700,
                  }}>{u.fullName[0]}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600 }}>{u.fullName}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
                      {u.email && <span>{u.email} · </span>}
                      {u.phoneNumber && <span>📞 {u.phoneNumber}</span>}
                      {u.telegramId && <span> · ✈️ {u.telegramId}</span>}
                    </div>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', flexShrink: 0 }}>
                    {formatPersianDateTime(u.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* آنلاین */}
        {tab === 'online' && (
          <div>
            <div style={{ ...glassBox, padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-brand)', fontSize: '13px', marginBottom: '8px' }}>کاربران آنلاین (هم‌اکنون)</div>
              <div style={{ color: '#22c55e', fontSize: '40px', fontWeight: 700 }}>
                {currentOnline}
                <span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: 400, marginRight: '8px' }}>نفر</span>
              </div>
            </div>
            <div style={{ ...glassBox, padding: '20px' }}>
              <div style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600, marginBottom: '16px', textAlign: 'center' }}>
                آنلاین‌ها بر اساس ساعت (۲۴ ساعت اخیر)
              </div>
              <BarChart data={hourlyStats} labelKey="hour" valueKey="count" color="#22c55e" />
            </div>
          </div>
        )}

        {/* لیست گوشی‌ها */}
        {tab === 'phones' && (
          <div style={glassBox}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--card-border)', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600 }}>
              لیست گوشی‌ها ({phones.length})
            </div>
            {phones.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>گوشی‌ای ثبت نشده</div>}
            {phones.map(phone => (
              <div key={phone.id} className="admin-phone-row" style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 18px', borderBottom: '1px solid var(--card-border)',
              }}>
                {phone.images[0]
                  ? <img src={phone.images[0]} alt="" style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                  : <div style={{ width: '52px', height: '52px', background: 'var(--placeholder-bg)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>📱</div>
                }
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600 }}>{phone.brand} {phone.model}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
                    {phone.section === 'new_box' ? 'قیمت روز' : `${phone.price.toLocaleString('en-US')} ت`} · {phone.storage} · {phone.views} بازدید
                  </div>
                </div>
                {phone.section && sectionBadge[phone.section] && (
                  <span style={{
                    fontSize: '11px', padding: '3px 8px', borderRadius: '20px', flexShrink: 0,
                    background: sectionBadge[phone.section].bg,
                    color: sectionBadge[phone.section].color,
                  }}>{sectionBadge[phone.section].label}</span>
                )}
                <span style={{
                  fontSize: '11px', padding: '3px 10px', borderRadius: '20px', flexShrink: 0,
                  background: phone.isSold ? 'rgba(251, 190, 36, 0.32)' : 'rgba(111, 227, 167, 0.34)',
                  color: phone.isSold ? '#fbbf24' : 'rgb(0, 184, 0)',
                  border: `1px solid ${phone.isSold ? '#fbbe2494' : '#00ff3733'}`,
                }}>{phone.isSold ? 'فروخته شده' : 'موجود'}</span>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button onClick={() => handleToggleSold(phone)} style={actionBtn('#b103d4', 'rgba(210, 0, 252, 0.34)')}>
                    {phone.isSold ? 'موجود کن' : 'فروخته شد'}
                  </button>
                  <button onClick={() => handleEdit(phone)} style={actionBtn('var(--text-brand)', 'rgba(138, 180, 248, 0.45)')}>ویرایش</button>
                  <button onClick={() => handleDelete(phone.id)} style={actionBtn('#f87171', 'rgba(248, 113, 113, 0.45)')}>حذف</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* درخواست‌ها */}
        {tab === 'requests' && (
          <div style={glassBox}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--card-border)', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600 }}>
              درخواست‌های خرید ({requests.length})
            </div>
            {requests.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>هنوز درخواستی ثبت نشده</div>}
              {requests.map(req => (
                <div key={req.id} className="admin-request-row" style={{ padding: '16px 18px', borderBottom: '1px solid var(--card-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px' }}>{req.fullName}</span>
                  <span style={{
                    fontSize: '11px', padding: '3px 10px', borderRadius: '20px',
                    background: 'rgba(138,180,248,0.1)', color: 'var(--text-brand)',
                    border: '1px solid rgba(138,180,248,0.2)',
                  }}>{req.phone.brand} {req.phone.model}</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>📞 {req.phoneNumber}</div>
                {req.telegramId && <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>✈️ {req.telegramId}</div>}
                {req.message && <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>💬 {req.message}</div>}
              </div>
            ))}
          </div>
        )}

        {/* افزودن / ویرایش */}
        {tab === 'add' && (
          <div style={{ ...glassBox, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <div style={{ width: '4px', height: '16px', background: 'var(--text-brand)', borderRadius: '2px' }} />
              <h1 style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: 600 }}>
                {editPhone ? 'ویرایش گوشی' : 'افزودن گوشی جدید'}
              </h1>
            </div>

            <div className="responsive-two-col">
              <div><label style={labelStyle}>برند</label><input name="brand" value={form.brand} onChange={handleChange} placeholder="مثلاً Apple" style={inputStyle} /></div>
              <div><label style={labelStyle}>مدل</label><input name="model" value={form.model} onChange={handleChange} placeholder="مثلاً iPhone 14 Pro" style={inputStyle} /></div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>بخش نمایش</label>
                <select name="section" value={form.section} onChange={handleChange} style={inputStyle}>
                  {sections.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>

              {form.section !== 'new_box' ? (
                <div>
                  <label style={labelStyle}>قیمت (تومان)</label>
                  <input name="price" value={form.price} onChange={handleChange} type="number" style={inputStyle} />
                </div>
              ) : (
                <div>
                  <label style={labelStyle}>قیمت</label>
                  <div style={{ ...inputStyle, color: 'var(--text-muted)', fontSize: '13px' }}>📞 قیمت روز — استعلام بگیرید</div>
                </div>
              )}

              <div><label style={labelStyle}>حافظه</label><input name="storage" value={form.storage} onChange={handleChange} placeholder="مثلاً 256GB" style={inputStyle} /></div>
              <div><label style={labelStyle}>رم</label><input name="ram" value={form.ram} onChange={handleChange} placeholder="مثلاً 6GB" style={inputStyle} /></div>
              <div><label style={labelStyle}>رنگ</label><input name="color" value={form.color} onChange={handleChange} placeholder="مثلاً مشکی" style={inputStyle} /></div>

              {form.section !== 'new_box' && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>وضعیت</label>
                  <select name="condition" value={form.condition} onChange={handleChange} style={inputStyle}>
                    {conditions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              )}

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>توضیحات</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>عکس‌ها</label>
                <label style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--placeholder-bg)', border: '1px dashed var(--input-border)',
                  borderRadius: '10px', padding: '18px',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  color: 'var(--text-secondary)', fontSize: '14px',
                }}>
                  {uploading ? '⏳ در حال آپلود...' : '+ انتخاب عکس'}
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} style={{ display: 'none' }} />
                </label>
                {images.length > 0 && (
                  <div className="responsive-four" style={{ gap: '8px', marginTop: '12px' }}>
                    {images.map((url, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <img src={url} alt="" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                        <button onClick={() => setImages(prev => prev.filter((_, j) => j !== i))} style={{
                          position: 'absolute', top: '4px', left: '4px',
                          background: 'rgba(248,113,113,0.85)', border: 'none',
                          borderRadius: '50%', width: '20px', height: '20px',
                          color: '#fff', fontSize: '12px', cursor: 'pointer',
                        }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {message && (
              <div style={{
                marginTop: '16px', padding: '10px 14px', borderRadius: '8px',
                background: message.ok ? 'rgba(111,227,168,0.1)' : 'rgba(248,113,113,0.1)',
                color: message.ok ? '#6fe3a8' : '#f87171',
                border: `1px solid ${message.ok ? '#6fe3a840' : '#f8717140'}`,
                fontSize: '14px',
              }}>{message.text}</div>
            )}

            <button onClick={handleSubmit} disabled={loading} style={{
              marginTop: '20px', width: '100%',
              background: loading ? 'var(--btn-bg)' : 'var(--btn-active-bg)',
              border: '1px solid var(--btn-active-border)',
              borderRadius: '10px',
              color: loading ? 'var(--text-muted)' : 'var(--text-primary)',
              fontSize: '15px', fontWeight: 600, padding: '13px',
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              backdropFilter: 'blur(8px)',
            }}>
              {loading ? 'در حال ثبت...' : editPhone ? 'ذخیره تغییرات' : 'ثبت گوشی'}
            </button>
          </div>
        )}
      </div>
    </div>
    </AdminGuard>
  )
}
