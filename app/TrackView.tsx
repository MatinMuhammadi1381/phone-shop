'use client'

import { useEffect } from 'react'

export default function TrackView({ phoneId }: { phoneId: number }) {
  useEffect(() => {
    fetch('/api/view-history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneId }),
    }).catch(() => {})
  }, [phoneId])

  return null
}
