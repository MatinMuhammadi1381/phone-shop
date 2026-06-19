import Link from 'next/link'

export default function Logo({ size = 'normal' }: { size?: 'normal' | 'large' }) {
  const markSize = size === 'large' ? 48 : 34
  const titleSize = size === 'large' ? 32 : 22

  return (
    <Link href="/" style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      color: 'var(--text-primary)',
      fontWeight: 800,
    }}>
      <span style={{
        width: `${markSize}px`,
        height: `${markSize}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #ec4899 0%, #ef4444 48%, #8b5cf6 100%)',
        color: '#fff',
        fontSize: `${Math.round(markSize * 0.52)}px`,
        fontWeight: 900,
        boxShadow: '0 8px 18px rgba(236,72,153,0.25)',
      }}>
        T
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ fontSize: `${titleSize}px`, color: 'var(--text-primary)' }}>T-Mobile</span>
        {size === 'large' && (
          <span style={{ marginTop: '8px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            فروشگاه گوشی هوشمند
          </span>
        )}
      </span>
    </Link>
  )
}
