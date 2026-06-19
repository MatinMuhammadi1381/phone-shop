'use client'

import { useEffect, useState } from 'react'

type Review = {
  id: number
  rating: number
  comment: string | null
  createdAt: string
  user: { id: number; fullName: string }
}

export default function Reviews({ phoneId, isLoggedIn }: { phoneId: number; isLoggedIn: boolean }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchReviews = async () => {
    const res = await fetch(`/api/reviews?phoneId=${phoneId}`)
    if (res.ok) setReviews(await res.json())
  }

  useEffect(() => { fetchReviews() }, [phoneId])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneId, rating, comment: comment.trim() || null }),
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok) {
      setMessage({ text: 'نظر شما ثبت شد ✅', ok: true })
      setComment('')
      setRating(5)
      fetchReviews()
    } else {
      setMessage({ text: data.error ?? 'خطا', ok: false })
    }
    setLoading(false)
  }

  const avg = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const glassCard: React.CSSProperties = {
    background: 'var(--card-bg)', border: '1px solid var(--card-border)',
    backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '20px',
  }

  return (
    <div style={glassCard}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <h3 style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: 700 }}>نظرات و امتیازات</h3>
        {avg && (
          <span style={{
            background: 'rgba(251,191,36,0.15)', color: '#fbbf24',
            padding: '3px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
          }}>
            ⭐ {avg}
          </span>
        )}
        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>({reviews.length} نظر)</span>
      </div>

      {reviews.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {reviews.map(r => (
            <div key={r.id} style={{
              background: 'var(--placeholder-bg)', borderRadius: '12px', padding: '14px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }}>{r.user.fullName}</span>
                <span style={{ color: '#fbbf24', fontSize: '13px' }}>{'⭐'.repeat(r.rating)}</span>
              </div>
              {r.comment && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.7 }}>{r.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {isLoggedIn ? (
        <form onSubmit={submit} style={{ display: 'grid', gap: '12px' }}>
          <div>
            <label style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '6px', display: 'block' }}>
              امتیاز شما
            </label>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button" onClick={() => setRating(n)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px',
                  color: n <= rating ? '#fbbf24' : 'var(--text-muted)',
                  transition: 'transform 0.15s', transform: n <= rating ? 'scale(1.1)' : 'scale(1)',
                }}>
                  {n <= rating ? '⭐' : '☆'}
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="نظر خود را بنویسید (اختیاری)"
            rows={3}
            style={{
              width: '100%', background: 'var(--input-bg)', border: '1px solid var(--input-border)',
              borderRadius: '8px', padding: '10px 12px', color: 'var(--text-primary)',
              fontSize: '14px', fontFamily: 'inherit', outline: 'none', resize: 'vertical',
            }}
          />
          <button
            disabled={loading}
            style={{
              background: loading ? 'var(--btn-bg)' : 'var(--btn-active-bg)',
              border: '1px solid var(--btn-active-border)', color: 'var(--btn-active-color)',
              borderRadius: '10px', padding: '11px', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', fontWeight: 600, fontSize: '14px',
            }}
          >
            {loading ? 'در حال ثبت...' : 'ثبت نظر'}
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
      ) : (
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          برای ثبت نظر <a href="/auth" style={{ color: 'var(--text-brand)' }}>وارد شوید</a>.
        </p>
      )}
    </div>
  )
}
