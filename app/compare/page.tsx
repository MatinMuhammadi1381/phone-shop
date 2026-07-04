/* eslint-disable @next/next/no-img-element */
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { conditionLabel } from '@/lib/phone-meta'

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
  section: string | null
  isSold: boolean
}

const STORAGE_KEY = 'tmobile_compare_ids'

export default function ComparePage() {
  const [phones, setPhones] = useState<Phone[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as number[]
    if (ids.length === 0) {
      setLoading(false)
      return
    }
    Promise.all(
      ids.map(async (id) => {
        const res = await fetch(`/api/phones/${id}`)
        return res.ok ? res.json() : null
      })
    ).then(results => {
      setPhones(results.filter(Boolean))
      setLoading(false)
    })
  }, [])

  const removePhone = (id: number) => {
    const ids = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as number[]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.filter(x => x !== id)))
    window.dispatchEvent(new Event('compare-change'))
    setPhones(prev => prev.filter(p => p.id !== id))
  }

  const allKeys: { label: string; key: keyof Phone; render?: (p: Phone) => string }[] = [
    { label: 'برند', key: 'brand' },
    { label: 'مدل', key: 'model' },
    { label: 'قیمت', key: 'price', render: (p) => p.section === 'new_box' ? 'قیمت روز' : `${p.price.toLocaleString('en-US')} تومان` },
    { label: 'حافظه', key: 'storage' },
    { label: 'رم', key: 'ram' },
    { label: 'رنگ', key: 'color' },
    { label: 'وضعیت', key: 'condition', render: (p) => conditionLabel[p.condition] ?? p.condition },
  ]

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        در حال بارگذاری...
      </div>
    )
  }

  if (phones.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', color: 'var(--text-secondary)' }}>
        <div style={{ fontSize: '48px' }}>📱</div>
        <p>گوشی‌ای برای مقایسه انتخاب نشده</p>
        <Link href="/#phones" style={{ background: 'var(--btn-active-bg)', border: '1px solid var(--btn-active-border)', color: 'var(--btn-active-color)', borderRadius: '10px', padding: '10px 20px', fontSize: '14px', fontWeight: 600 }}>
          برگشت به فروشگاه
        </Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', padding: '16px 20px 60px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <div style={{ width: '4px', height: '16px', background: 'var(--text-brand)', borderRadius: '2px' }} />
          <h1 style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: 700 }}>مقایسه گوشی‌ها</h1>
          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>({phones.length} گوشی)</span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'right', padding: '10px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid var(--card-border)', minWidth: '100px' }}>
                مشخصات
              </th>
              {phones.map(p => (
                <th key={p.id} style={{ textAlign: 'center', padding: '10px', borderBottom: '1px solid var(--card-border)' }}>
                  <button
                    type="button"
                    onClick={() => removePhone(p.id)}
                    style={{
                      background: 'rgba(248,113,113,0.1)', border: 'none', borderRadius: '50%',
                      width: '24px', height: '24px', cursor: 'pointer', color: '#f87171',
                      fontSize: '14px', lineHeight: '1', marginBottom: '6px',
                    }}
                  >
                    ×
                  </button>
                  <Link href={`/phones/${p.id}`}>
                    {p.images[0]
                      ? <img src={p.images[0]} alt={p.model} style={{ width: '120px', height: '120px', objectFit: 'contain', display: 'block', margin: '0 auto 6px', background: 'var(--placeholder-bg)', borderRadius: '8px' }} />
                      : <div style={{ width: '120px', height: '120px', background: 'var(--placeholder-bg)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 6px' }}>📱</div>
                    }
                    <div style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600 }}>{p.model}</div>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allKeys.map(({ label, key, render }) => (
              <tr key={key}>
                <td style={{ padding: '12px 10px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid var(--card-border)' }}>
                  {label}
                </td>
                {phones.map(p => (
                  <td key={p.id} style={{ padding: '12px 10px', textAlign: 'center', color: 'var(--text-primary)', fontSize: '13px', borderBottom: '1px solid var(--card-border)' }}>
                    {render ? render(p) : String(p[key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
            {phones.some(p => p.description) && (
              <tr>
                <td style={{ padding: '12px 10px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid var(--card-border)' }}>
                  توضیحات
                </td>
                {phones.map(p => (
                  <td key={p.id} style={{ padding: '12px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', lineHeight: 1.7, borderBottom: '1px solid var(--card-border)' }}>
                    {p.description || '—'}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
