'use client'

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Phone = {
  id: number
  brand: string
  model: string
  price: number
  images: string[]
  storage: string
  ram: string
  section: string | null
}

export default function RelatedPhones({ phoneId }: { phoneId: number }) {
  const [phones, setPhones] = useState<Phone[]>([])

  useEffect(() => {
    fetch(`/api/phones/${phoneId}/related`)
      .then(res => res.json())
      .then(data => setPhones(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [phoneId])

  if (phones.length === 0) return null

  return (
    <div style={{ marginTop: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
        <div style={{ width: '3px', height: '12px', background: '#8ab4f8', borderRadius: '2px' }} />
        <h3 style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }}>
          پسندیدها
        </h3>
      </div>
      <div className="related-phones-grid">
        {phones.map(phone => (
          <Link key={phone.id} href={`/phones/${phone.id}`} className="phone-card" style={{ display: 'block' }}>
            {phone.images[0]
              ? <img src={phone.images[0]} alt={phone.model} style={{ width: '100%', height: '130px', objectFit: 'contain', background: 'var(--placeholder-bg)', display: 'block', padding: '4px' }} />
              : <div style={{ width: '100%', height: '130px', background: 'var(--placeholder-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>📱</div>
            }
            <div style={{ padding: '6px' }}>
              <div style={{ color: 'var(--text-brand)', fontSize: '11px' }}>{phone.brand}</div>
              <div style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }}>{phone.model}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                {phone.storage}
              </div>
              <div style={{ color: 'var(--text-price)', fontSize: '12px', fontWeight: 600, marginTop: '2px' }}>
                {phone.section === 'new_box' ? 'قیمت روز' : `${phone.price.toLocaleString('en-US')} ت`}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
