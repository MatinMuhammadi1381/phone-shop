/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import SavePhoneButton from './SavePhoneButton'
import CompareToggle from './CompareToggle'
import CompareBar from './CompareBar'
import AdvancedFilterDropdown from './AdvancedFilterDropdown'
import CategoryTransition from './CategoryTransition'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

type Phone = {
  id: number
  brand: string
  model: string
  price: number
  storage: string
  ram: string
  color: string
  condition: string
  description: string
  images: string[]
  isSold: boolean
  views?: number
  section?: string | null
  createdAt: Date
}

const conditionLabel: Record<string, { label: string; color: string; bg: string }> = {
  like_new: { label: 'مثل نو', color: '#22c55e', bg: '#1e3a2f' },
  good: { label: 'خوب', color: '#60a5fa', bg: '#1e2a3a' },
  fair: { label: 'قابل قبول', color: '#f59e0b', bg: '#3a2a1e' },
}

const brandOptions = [
  { label: 'همه', value: '', aliases: [] },
  { label: 'اپل', value: 'apple', aliases: ['apple', 'iphone', 'اپل', 'آیفون'] },
  { label: 'سامسونگ', value: 'samsung', aliases: ['samsung', 'galaxy', 'سامسونگ'] },
  { label: 'شیائومی', value: 'xiaomi', aliases: ['xiaomi', 'redmi', 'poco', 'شیائومی', 'پوکو'] },
  { label: 'هواوی', value: 'huawei', aliases: ['huawei', 'honor', 'هواوی', 'آنر'] },
  { label: 'ریلمی', value: 'realme', aliases: ['realme', 'ریلمی'] },
]

const sectionOptions = [
  { label: 'همه', value: '' },
  { label: '⭐ پیشنهادی', value: 'featured' },
  { label: '💰 قیمت مناسب', value: 'budget' },
  { label: '📦 اکبند', value: 'new_box' },
]

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

function buildHref(params: { brand?: string; section?: string; q?: string; ram?: string; storage?: string; priceMin?: string; priceMax?: string }, hash = 'phones') {
  const query = new URLSearchParams()
  if (params.brand) query.set('brand', params.brand)
  if (params.section) query.set('section', params.section)
  if (params.q) query.set('q', params.q)
  if (params.ram) query.set('ram', params.ram)
  if (params.storage) query.set('storage', params.storage)
  if (params.priceMin) query.set('priceMin', params.priceMin)
  if (params.priceMax) query.set('priceMax', params.priceMax)
  const qs = query.toString()
  return `/${qs ? `?${qs}` : ''}${hash ? `#${hash}` : ''}`
}

function normalizeText(value: string | null | undefined) {
  return (value ?? '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[۰١٢۳۴۵۶۷۸۹]/g, (digit) => {
      const map: Record<string, string> = {
        '۰': '0', '١': '1', '۲': '2', '۳': '3', '۴': '4', '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
      }
      return map[digit] ?? digit
    })
    .replace(/گیگابایت|گیگابایتی|گیگ/gi, 'gb')
    .replace(/ترابایت|ترابایتی/gi, 'tb')
    .replace(/[^0-9a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
}

function normalizeFilterValue(value: string | null | undefined) {
  return normalizeText(value).replace(/\s+/g, '')
}

function PhoneGrid({ phones, showAll = false, favoritePhoneIds, isLoggedIn }: { phones: Phone[], showAll?: boolean, favoritePhoneIds: Set<number>, isLoggedIn: boolean }) {
  const displayPhones = showAll
    ? [...phones].sort((a, b) => {
        const order: Record<string, number> = { featured: 0, budget: 1, new_box: 2 }
        return (order[a.section ?? ''] ?? 3) - (order[b.section ?? ''] ?? 3)
      })
    : phones

  return (
    <div className="phones-grid">
      {displayPhones.map((phone) => {
        const cond = phone.section === 'new_box'
          ? { label: 'اکبند', color: '#ff0000', bg: 'rgb(110, 57, 57)' }
          : (conditionLabel[phone.condition] ?? conditionLabel.fair)

        const badge = phone.section === 'featured'
          ? { label: '⭐ پیشنهادی', color: '#fff', bg: '#f97316' }
          : phone.section === 'budget'
          ? { label: '💰 قیمت مناسب', color: '#fff', bg: '#22c55e' }
          : phone.section === 'new_box'
          ? { label: '📦 اکبند', color: '#fff', bg: '#ef4444' }
          : null

        const isSaved = favoritePhoneIds.has(phone.id)

        return (
          <div key={phone.id} className="phone-card" style={{ position: 'relative' }}>
          <Link href={`/phones/${phone.id}`} className="phone-card-link">
              {badge && (
                <div style={{
                  position: 'absolute', top: '12px', right: '-4px',
                  background: badge.bg, color: badge.color,
                  fontSize: '12px', fontWeight: 700,
                  padding: '3px 10px 3px 8px',
                  borderRadius: '4px 0 0 4px', zIndex: 10,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  transform: 'skewY(-2deg)',
                }}>
                  <span style={{ display: 'inline-block', transform: 'skewY(2deg)' }}>
                    {badge.label}
                  </span>
                </div>
              )}
              {phone.images[0]
                ? <img src={phone.images[0]} alt={phone.model} className="phone-card-img" />
                : <div className="phone-card-img-placeholder">📱</div>
              }
              <div style={{ padding: '10px' }}>
                <div style={{ color: 'var(--text-brand)', fontSize: '16px', marginBottom: '3px' }}>{phone.brand}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <div style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: 600 }}>{phone.model}</div>
                  <div className="phone-card-actions">
                    <SavePhoneButton phoneId={phone.id} initialSaved={isSaved} isLoggedIn={isLoggedIn} iconOnly />
                    <CompareToggle phoneId={phone.id} />
                  </div>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '8px' }}>
                  {phone.storage} | {phone.ram} RAM | {phone.color}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-price)', fontSize: '16px', fontWeight: 600 }}>
                    {phone.section === 'new_box' ? 'قیمت روز' : `${phone.price.toLocaleString('en-US')} ت`}
                  </span>
                  <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '20px', background: cond.bg, color: cond.color }}>
                    {cond.label}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

function SectionTitle({ color, title }: { color: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
      <div style={{ width: '4px', height: '16px', background: color, borderRadius: '2px' }} />
      <h2 style={{ color: 'var(--section-title)', fontSize: '15px', fontWeight: 600 }}>{title}</h2>
    </div>
  )
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const queryParams = await searchParams
  const activeBrand = firstParam(queryParams.brand)
  const activeSection = firstParam(queryParams.section)
  const searchQuery = firstParam(queryParams.q).trim()
  const activeRam = firstParam(queryParams.ram)
  const activeStorage = firstParam(queryParams.storage)
  const priceMin = firstParam(queryParams.priceMin)
  const priceMax = firstParam(queryParams.priceMax)

  const allPhones = (await prisma.phone.findMany({ orderBy: { createdAt: 'desc' } })).filter(p => !p.isSold)

  const user = await getCurrentUser()
  const favoritePhoneIds = new Set<number>()
  if (user) {
    const userFavorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      select: { phoneId: true },
    })
    userFavorites.forEach((fav) => favoritePhoneIds.add(fav.phoneId))
  }

  const selectedBrand = brandOptions.find((brand) => brand.value === activeBrand)
  const filteredPhones = allPhones.filter((phone: Phone) => {
    const phoneText = [
      phone.brand,
      phone.model,
      phone.storage,
      phone.ram,
      phone.color,
      phone.condition,
      phone.description,
    ].map(normalizeText).join(' ')

    const matchesBrand = !selectedBrand?.value
      || selectedBrand.aliases.some((alias) => phoneText.includes(normalizeText(alias)))
    const matchesSection = !activeSection || phone.section === activeSection
    const matchesSearch = !searchQuery || phoneText.includes(normalizeText(searchQuery))

    const normalizedPhoneRam = normalizeFilterValue(phone.ram)
    const normalizedActiveRam = normalizeFilterValue(activeRam)
    const normalizedPhoneStorage = normalizeFilterValue(phone.storage)
    const normalizedActiveStorage = normalizeFilterValue(activeStorage)

    const matchesRam = !activeRam
      || normalizedPhoneRam === normalizedActiveRam
      || normalizedPhoneRam.includes(normalizedActiveRam)
      || normalizedActiveRam.includes(normalizedPhoneRam)
    const matchesStorage = !activeStorage
      || normalizedPhoneStorage === normalizedActiveStorage
      || normalizedPhoneStorage.includes(normalizedActiveStorage)
      || normalizedActiveStorage.includes(normalizedPhoneStorage)
    const matchesPriceMin = !priceMin || phone.price >= Number(priceMin)
    const matchesPriceMax = !priceMax || phone.price <= Number(priceMax)

    return matchesBrand && matchesSection && matchesSearch && matchesRam && matchesStorage && matchesPriceMin && matchesPriceMax
  })

  const hasActiveFilters = Boolean(activeBrand || activeSection || searchQuery || activeRam || activeStorage || priceMin || priceMax)
  const featured = filteredPhones.filter((p: Phone) => p.section === 'featured')
  const budget = filteredPhones.filter((p: Phone) => p.section === 'budget')
  const newBox = filteredPhones.filter((p: Phone) => p.section === 'new_box')

  return (
    <div className="page-enter" style={{ minHeight: '100vh' }}>
      <div className="home-layout">
        <aside className="glass-sidebar home-sidebar">
          {/* فیلترهای پیشرفته */}
          <div style={{ color: 'var(--text-secondary)', fontSize: '19px', marginBottom: '12px' }}>فیلتر پیشرفته</div>
          <AdvancedFilterDropdown />

          <div style={{ color: 'var(--text-secondary)', fontSize: '19px', margin: '20px 0 12px' }}>برند</div>
          {brandOptions.map((brand) => (
            <Link
              key={brand.label}
              href={buildHref({
                brand: brand.value,
                q: searchQuery || undefined,
                ram: activeRam || undefined,
                storage: activeStorage || undefined,
                priceMin: priceMin || undefined,
                priceMax: priceMax || undefined,
              })}
              className={`sidebar-btn ${activeBrand === brand.value ? 'active' : ''}`}
            >
              {brand.label}
            </Link>
          ))}
          <div style={{ color: 'var(--text-secondary)', fontSize: '19px', margin: '20px 0 12px' }}>بخش</div>
          {sectionOptions.map((item) => (
            <Link
              key={item.value || 'all-sections'}
              href={buildHref({
                section: item.value,
                q: searchQuery || undefined,
                ram: activeRam || undefined,
                storage: activeStorage || undefined,
                priceMin: priceMin || undefined,
                priceMax: priceMax || undefined,
              })}
              className={`sidebar-btn ${activeSection === item.value ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </aside>

        <main id="phones" style={{ flex: 1, padding: '4px 0', scrollMarginTop: '110px' }}>
          <CategoryTransition>
          {allPhones.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '80px' }}>
              هنوز گوشی‌ای اضافه نشده
            </p>
          ) : filteredPhones.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '80px' }}>
              نتیجه‌ای برای این فیلتر پیدا نشد
            </p>
          ) : hasActiveFilters ? (
            <div>
              <SectionTitle color="var(--text-brand)" title="نتیجه جستجو و فیلتر" />
                  <div style={{ marginBottom: '16px' }}>
                    <Link href="/#phones" className="sidebar-btn" style={{ maxWidth: '180px', textAlign: 'center' }}>
                      پاک‌کردن فیلترها
                    </Link>
                  </div>
              <PhoneGrid phones={filteredPhones} showAll={true} favoritePhoneIds={favoritePhoneIds} isLoggedIn={Boolean(user)} />
            </div>
          ) : (
            <>
              {featured.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <SectionTitle color="#f97316" title="⭐ پیشنهادی" />
                  <PhoneGrid phones={featured} favoritePhoneIds={favoritePhoneIds} isLoggedIn={Boolean(user)} />
                </div>
              )}
              {budget.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <SectionTitle color="#22c55e" title="💰 قیمت مناسب" />
                  <PhoneGrid phones={budget} favoritePhoneIds={favoritePhoneIds} isLoggedIn={Boolean(user)} />
                </div>
              )}
              {newBox.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <SectionTitle color="#ef4444" title="📦 اکبند" />
                  <PhoneGrid phones={newBox} favoritePhoneIds={favoritePhoneIds} isLoggedIn={Boolean(user)} />
                </div>
              )}
              <div>
                <SectionTitle color="var(--text-brand)" title="همه گوشی‌ها" />
                <PhoneGrid phones={allPhones} showAll={true} favoritePhoneIds={favoritePhoneIds} isLoggedIn={Boolean(user)} />
              </div>
            </>
          )}
          </CategoryTransition>
        </main>
      </div>
      <section id="about" style={{
        padding: '28px 24px 0',
        margin: '0 16px',
        scrollMarginTop: '110px',
        color: 'var(--text-secondary)',
      }}>
        <div className="glass-sidebar" style={{ maxWidth: '900px', margin: '0 auto', padding: '22px' }}>
          <SectionTitle color="var(--text-brand)" title="درباره ما" />
          <p style={{ fontSize: '15px', lineHeight: 2 }}>
            موبایل‌شاپ برای نمایش گوشی‌های موجود، دسته‌بندی پیشنهادها و ثبت درخواست خرید ساخته شده است.
            برای هر گوشی می‌توانید مشخصات، تصاویر و وضعیت موجودی را ببینید و از طریق فرم درخواست، اطلاعات تماس خود را ثبت کنید.
          </p>
        </div>
      </section>
      <footer style={{
        padding: '16px 24px 20px', margin: '0 16px 16px',
        textAlign: 'center',
      }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          borderTop: '1px solid var(--input-border)',
          paddingTop: '18px',
        }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 2 }}>
            <span>© 2026</span>
            <span> </span>
            <span>Design by Matin Muhammadi</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
