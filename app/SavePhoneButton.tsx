'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SavePhoneButton({
  phoneId,
  initialSaved,
  isLoggedIn,
  iconOnly = false,
}: {
  phoneId: number
  initialSaved: boolean
  isLoggedIn: boolean
  iconOnly?: boolean
}) {
  const router = useRouter()
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)

  const toggleSave = async () => {
    if (!isLoggedIn) {
      router.push('/auth')
      return
    }

    setLoading(true)
    const res = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneId }),
    })

    if (res.ok) {
      const data = await res.json()
      setSaved(Boolean(data.saved))
      router.refresh()
    }
    setLoading(false)
  }

  const classes = ['save-button']
  if (iconOnly) classes.push('icon-only')
  if (saved) classes.push('saved')

  return (
    <button
      className={classes.join(' ')}
      onClick={toggleSave}
      disabled={loading}
      aria-label={saved ? 'حذف از ذخیره‌ها' : 'ذخیره در ذخیره‌ها'}
    >
      <svg className="save-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6 4H18C18.553 4 19 4.44772 19 5V21L12 17.5L5 21V5C5 4.44772 5.44772 4 6 4Z"
          className="save-icon-path"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
      {!iconOnly && (loading ? '...' : saved ? 'ذخیره شده' : 'ذخیره در علاقه‌مندی‌ها')}
    </button>
  )
}
