'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import AdvancedFilterDropdown from './AdvancedFilterDropdown'
import LogoutButton from './LogoutButton'

type UserSummary = {
  email?: string | null
  googleId?: string | null
  fullName: string
  phoneNumber?: string | null
} | null

type MenuKey = 'brands' | 'sections' | null

const brands = [
  { label: 'همه برندها', value: '' },
  { label: 'اپل', value: 'apple' },
  { label: 'سامسونگ', value: 'samsung' },
  { label: 'شیائومی', value: 'xiaomi' },
  { label: 'هواوی', value: 'huawei' },
  { label: 'ریلمی', value: 'realme' },
]

const sections = [
  { label: 'همه بخش‌ها', value: '' },
  { label: 'پیشنهادی', value: 'featured' },
  { label: 'قیمت مناسب', value: 'budget' },
  { label: 'اکبند', value: 'new_box' },
]

function buildHref({
  searchParams,
  brand,
  section,
}: {
  searchParams: URLSearchParams
  brand?: string
  section?: string
}) {
  const nextParams = new URLSearchParams(searchParams.toString())

  if (brand !== undefined) {
    if (brand) nextParams.set('brand', brand)
    else nextParams.delete('brand')
  }
  if (section !== undefined) {
    if (section) nextParams.set('section', section)
    else nextParams.delete('section')
  }

  const qs = nextParams.toString()
  return `/${qs ? `?${qs}` : ''}#phones`
}

export default function SiteChrome({
  user,
  children,
}: {
  user: UserSummary
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [menu, setMenu] = useState<MenuKey>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClick)
    }
    return () => document.removeEventListener('mousedown', handleClick)
  }, [userMenuOpen])

  const params = new URLSearchParams(searchParams.toString())
  const activeBrand = params.get('brand') ?? ''
  const activeSection = params.get('section') ?? ''
  const q = params.get('q') ?? ''

  const [search, setSearch] = useState(q)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  useEffect(() => {
    setSearch(q)
  }, [q])

  const isComparePage = pathname === '/compare'

  const runSearch = () => {
    const nextParams = new URLSearchParams(params.toString())
    if (search.trim()) {
      nextParams.set('q', search.trim())
    } else {
      nextParams.delete('q')
    }
    const qs = nextParams.toString()
    router.push(`/${qs ? `?${qs}` : ''}#phones`)
  }

  const navButtonStyle = (active: boolean): React.CSSProperties => ({
    width: '100%',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 14px',
    background: active ? 'var(--btn-active-bg)' : 'var(--btn-bg)',
    color: active ? 'var(--btn-active-color)' : 'var(--btn-color)',
    fontFamily: 'inherit',
    fontSize: '14px',
    textAlign: 'right',
    cursor: 'pointer',
    borderBottom: active ? '1px solid var(--btn-active-border)' : '1px solid var(--btn-border)',
  })

  const closeMenu = () => setMenu(null)

  return (
    <div className="site-shell">
      <header className="site-header glass-nav">
        <Logo />
        <div className="site-search desktop-only" style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '22px', color: 'var(--text-muted)', pointerEvents: 'none' }}>⌕</span>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                runSearch()
              }
            }}
            placeholder="جستجو..."
            className="search-input"
            style={{ paddingRight: '36px' }}
          />
        </div>
        <div className="site-header-actions">
          <Link
            href="/compare"
            className="site-account-link"
            style={{ background: isComparePage ? 'var(--btn-active-bg)' : 'var(--btn-bg)' }}
          >
            ⇄ مقایسه
          </Link>
          <div style={{ position: 'relative' }} ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              title={user ? user.fullName : 'ورود'}
              style={{
                background: userMenuOpen ? 'var(--btn-active-bg)' : 'var(--btn-bg)',
                border: '1px solid var(--btn-border)',
                borderRadius: '10px',
                padding: '8.5px 11px',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                color: userMenuOpen ? 'var(--btn-active-color)' : 'var(--btn-color)',
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
            </button>

            {userMenuOpen && (
              <div
                style={{
                  position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 500,
                  background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                  backdropFilter: 'blur(16px)', borderRadius: '14px',
                  padding: '8px', minWidth: '200px',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
                }}
              >
                {user ? (
                  <>
                    <div style={{
                      padding: '8px 10px', borderBottom: '1px solid var(--card-border)',
                      marginBottom: '4px', color: 'var(--text-primary)',
                    }}>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{user.fullName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {user.phoneNumber || user.email || ''}
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'block', padding: '10px 12px', borderRadius: '10px',
                        color: 'var(--text-primary)', fontSize: '14px',
                        textDecoration: 'none', transition: 'background 0.15s',
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'var(--btn-active-bg)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      📊 داشبورد
                    </Link>
                    <Link
                      href="/dashboard?tab=requests"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'block', padding: '10px 12px', borderRadius: '10px',
                        color: 'var(--text-primary)', fontSize: '14px',
                        textDecoration: 'none', transition: 'background 0.15s',
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'var(--btn-active-bg)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      📋 درخواست‌ها
                    </Link>
                    <Link
                      href="/dashboard?tab=favorites"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'block', padding: '10px 12px', borderRadius: '10px',
                        color: 'var(--text-primary)', fontSize: '14px',
                        textDecoration: 'none', transition: 'background 0.15s',
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'var(--btn-active-bg)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      ❤️ علاقه‌مندی‌ها
                    </Link>
                    <Link
                      href="/dashboard?tab=views"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'block', padding: '10px 12px', borderRadius: '10px',
                        color: 'var(--text-primary)', fontSize: '14px',
                        textDecoration: 'none', transition: 'background 0.15s',
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'var(--btn-active-bg)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      👁️ بازدیدها
                    </Link>
                    <div style={{ borderTop: '1px solid var(--card-border)', marginTop: '4px', paddingTop: '4px' }}>
                      <LogoutButton compact />
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'block', padding: '10px 12px', borderRadius: '10px',
                        color: 'var(--text-primary)', fontSize: '14px',
                        textDecoration: 'none', transition: 'background 0.15s',
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'var(--btn-active-bg)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      ورود / ثبت‌نام
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <ThemeToggle />
        </div>
      </header>

      <main className="site-main">
        {children}
      </main>
      {mobileSearchOpen && (
        <div className="mobile-search-panel mobile-only">
          <div className="mobile-search-expand">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  runSearch()
                }
              }}
              placeholder="عبارت جستجو را وارد کنید"
              className="mobile-search-input"
            />
            <button type="button" className="mobile-search-button" onClick={runSearch}>
              جستجو
            </button>
          </div>
          <AdvancedFilterDropdown />
        </div>
      )}

      <nav className="mobile-dock glass-dock" aria-label="ناوبری موبایل">
        <button
          type="button"
          className="dock-button"
          aria-expanded={menu === 'brands'}
          onClick={() => setMenu(menu === 'brands' ? null : 'brands')}
        >
          <span className="dock-icon">☰</span>
          <span>گروه‌ها</span>
        </button>

        <button
          type="button"
          className="dock-button search-toggle"
          aria-expanded={mobileSearchOpen}
          onClick={() => setMobileSearchOpen((prev) => !prev)}
        >
          <span className="dock-icon">⌕</span>
          <span>جستجو</span>
        </button>

        <Link href="/" className={`dock-home ${pathname === '/' ? 'active' : ''}`}>
          <span className="dock-icon">⌂</span>
          <span>خانه</span>
        </Link>

        <Link href="/compare" className={`dock-home ${isComparePage ? 'active' : ''}`}>
          <span className="dock-icon">⇄</span>
          <span>مقایسه</span>
        </Link>

        <button
          type="button"
          className="dock-button"
          aria-expanded={menu === 'sections'}
          onClick={() => setMenu(menu === 'sections' ? null : 'sections')}
        >
          <span className="dock-icon">⋯</span>
          <span>بخش‌ها</span>
        </button>
      </nav>

      {menu && (
        <div className="sheet-backdrop" role="presentation" onClick={closeMenu}>
          <section className="sheet-panel glass-sheet" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="sheet-head">
              <div>
                <div className="sheet-title">
                  {menu === 'brands' ? 'گروه‌ها' : 'بخش‌ها'}
                </div>
                <div className="sheet-subtitle">
                  {menu === 'brands'
                    ? 'انتخاب یک برند، فروشگاه را روی همان گروه می‌آورد.'
                    : 'انتخاب یک بخش، گوشی‌های همان دسته را نشان می‌دهد.'}
                </div>
              </div>
              <button type="button" className="sheet-close" onClick={closeMenu}>
                ×
              </button>
            </div>

            <div className="sheet-grid">
              {(menu === 'brands' ? brands : sections).map((item) => {
                const href = menu === 'brands'
                  ? buildHref({ searchParams: params, brand: item.value })
                  : buildHref({ searchParams: params, section: item.value })
                const active = menu === 'brands'
                  ? activeBrand === item.value
                  : activeSection === item.value

                return (
                  <Link
                    key={item.label}
                    href={href}
                    onClick={closeMenu}
                    className="sheet-link"
                    style={navButtonStyle(active)}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>

            <div className="sheet-footer">
              <button
                type="button"
                className="sheet-clear"
                onClick={() => {
                  closeMenu()
                  router.push('/#phones')
                }}
              >
                رفتن به لیست گوشی‌ها
              </button>
              {user && (
                <Link href="/dashboard" onClick={closeMenu} className="sheet-account">
                  داشبورد من
                </Link>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
