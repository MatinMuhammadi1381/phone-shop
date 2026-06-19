'use client'

import { ChangeEvent } from 'react'

export default function PriceFilterInputs({ priceMin, priceMax }: { priceMin: string; priceMax: string }) {
  const updateQuery = (field: 'priceMin' | 'priceMax', value: string) => {
    const params = new URLSearchParams(window.location.search)
    if (value) {
      params.set(field, value)
    } else {
      params.delete(field)
    }

    const search = params.toString()
    window.location.href = `${window.location.pathname}${search ? `?${search}` : ''}#phones`
  }

  const handlePriceMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateQuery('priceMin', e.target.value)
  }

  const handlePriceMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateQuery('priceMax', e.target.value)
  }

  return (
    <div style={{ display: 'flex', gap: '6px' }}>
      <input
        type="number"
        placeholder="حداقل"
        defaultValue={priceMin}
        onChange={handlePriceMinChange}
        style={{
          width: '100%', background: 'var(--input-bg)', border: '1px solid var(--input-border)',
          borderRadius: '6px', padding: '6px 8px', color: 'var(--text-primary)',
          fontSize: '12px', fontFamily: 'inherit', outline: 'none',
        }}
      />
      <input
        type="number"
        placeholder="حداکثر"
        defaultValue={priceMax}
        onChange={handlePriceMaxChange}
        style={{
          width: '100%', background: 'var(--input-bg)', border: '1px solid var(--input-border)',
          borderRadius: '6px', padding: '6px 8px', color: 'var(--text-primary)',
          fontSize: '12px', fontFamily: 'inherit', outline: 'none',
        }}
      />
    </div>
  )
}
