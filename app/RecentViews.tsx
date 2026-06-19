'use client'

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { useEffect, useState } from 'react'

type ViewItem = {
  id: number
  phone: {
    id: number
    brand: string
    model: string
    price: number
    images: string[]
    storage: string
    ram: string
    section: string | null
  }
}

export default function RecentViews() {
  const [items, setItems] = useState<ViewItem[]>([])

  useEffect(() => {
    fetch('/api/view-history')
      .then(res => res.ok ? res.json() : [])
      .then(data => setItems(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <div style={{ width: '4px', height: '16px', background: '#c084fc', borderRadius: '2px' }} />
        <h3 style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 600 }}>آخرین بازدیدهای شما</h3>
      </div>
      {items.length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px', background: 'var(--glass)', borderRadius: '12px', border: '1px solid var(--btn-border)' }}>
          بازدیدی ثبت نشده
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
          {items.slice(0, 10).map(item => (
            <Link key={item.id} href={`/phones/${item.phone.id}`} className="phone-card" style={{
              display: 'block', minWidth: '140px', maxWidth: '140px', flexShrink: 0,
            }}>
              {item.phone.images[0]
                ? <img src={item.phone.images[0]} alt={item.phone.model} style={{ width: '100%', height: '140px', objectFit: 'contain', background: 'var(--placeholder-bg)', display: 'block' }} />
                : <div style={{ width: '100%', height: '140px', background: 'var(--placeholder-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>📱</div>
              }
              <div style={{ padding: '8px' }}>
                <div style={{ color: 'var(--text-brand)', fontSize: '11px' }}>{item.phone.brand}</div>
                <div style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.phone.model}</div>
                <div style={{ color: 'var(--text-price)', fontSize: '12px', fontWeight: 600 }}>
                  {item.phone.section === 'new_box' ? 'قیمت روز' : `${item.phone.price.toLocaleString('en-US')} ت`}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
