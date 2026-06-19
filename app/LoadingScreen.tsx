/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useEffect, useState } from 'react'
import Logo from './Logo'

export default function LoadingScreen({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    setIsDark(saved === 'dark')

    const duration = 2500
    const interval = 20
    const steps = duration / interval
    let current = 0

    const timer = setInterval(() => {
      current++
      setProgress(Math.min((current / steps) * 100, 100))
      if (current >= steps) {
        clearInterval(timer)
        setFadeOut(true)
        setTimeout(() => setLoading(false), 400)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  const bg = isDark
    ? 'linear-gradient(180deg, #0a1628 0%, #0d1b2e 100%)'
    : 'linear-gradient(180deg, #f0f4ff 0%, #e8eeff 100%)'

  const barBg = isDark ? 'rgba(138,180,248,0.15)' : 'rgba(80,130,255,0.2)'
  const percentColor = isDark ? 'rgba(138,180,248,0.5)' : 'rgba(37,99,235,0.8)'

  return (
    <>
      {loading && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: bg,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '40px', direction: 'ltr',
          opacity: fadeOut ? 0 : 1,
          transition: 'opacity 0.4s ease',
          pointerEvents: fadeOut ? 'none' : 'all',
        }}>
          <div style={{ transform: 'scale(1.2)' }}>
            <Logo size="large" />
          </div>

          <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              width: '100%', height: '6px',
              background: barBg,
              borderRadius: '99px', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: isDark
                  ? 'linear-gradient(90deg, #3b82f6, #8ab4f8)'
                  : 'linear-gradient(90deg, #2563eb, #60a5fa)',
                borderRadius: '99px',
                transition: 'width 0.02s linear',
                boxShadow: isDark
                  ? '0 0 10px rgba(138,180,248,0.5)'
                  : '0 0 12px rgba(37,99,235,0.4)',
              }} />
            </div>
            <div style={{
              color: percentColor,
              fontSize: '13px',
              fontWeight: 600,
              textAlign: 'center',
              fontFamily: 'inherit',
              letterSpacing: '1px',
            }}>
              {Math.round(progress)}%
            </div>
          </div>
        </div>
      )}
      <div style={{ visibility: loading && !fadeOut ? 'hidden' : 'visible' }}>
        {children}
      </div>
    </>
  )
}