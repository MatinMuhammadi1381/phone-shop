'use client'

import { useEffect, useState } from 'react'
import { addCompareId, removeCompareId, isCompareId } from './CompareBar'

export default function CompareToggle({ phoneId }: { phoneId: number }) {
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setChecked(isCompareId(phoneId))
  }, [phoneId])

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (checked) {
      removeCompareId(phoneId)
      setChecked(false)
    } else {
      addCompareId(phoneId)
      setChecked(true)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title={checked ? 'حذف از مقایسه' : 'افزودن به مقایسه'}
      className={`compare-toggle-button ${checked ? 'checked' : ''}`}
    >
      <span>{checked ? '✓' : '⇄'}</span>
    </button>
  )
}
