/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') {
      setIsDark(true)
      document.body.classList.add('dark')
    } else {
      setIsDark(false)
      document.body.classList.remove('dark')
    }
  }, [])

  const toggle = () => {
    if (isDark) {
      document.body.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      document.body.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }

  return (
    <button onClick={toggle} style={{
      background: 'var(--btn-bg)',
      border: '1px solid var(--btn-border)',
      borderRadius: '10px',
      padding: '6px 12px',
      cursor: 'pointer',
      fontSize: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
    }}>
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}