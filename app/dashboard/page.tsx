/* eslint-disable @next/next/no-img-element */
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { PurchaseRequest, Phone } from '@prisma/client'
import LogoutButton from '../LogoutButton'
import RecentViews from '../RecentViews'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import EditProfileForm from './EditProfileForm'

type RequestWithPhone = PurchaseRequest & { phone: Phone }

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

const conditionLabel: Record<string, { label: string; color: string }> = {
  like_new: { label: 'مثل نو', color: '#6fe3a8' },
  good: { label: 'خوب', color: '#60a5fa' },
  fair: { label: 'قابل قبول', color: '#fbbf24' },
}

export default async function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
  const tab = (await searchParams).tab as string | undefined
  const user = await getCurrentUser()
  if (!user) redirect('/auth')

  const [favorites, requests] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId: user.id },
      include: { phone: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.purchaseRequest.findMany({
      where: { userId: user.id },
      include: { phone: true },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const glassCard: React.CSSProperties = {
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '16px',
  }

  const activeTab = tab || 'dashboard'
  const showProfile = activeTab === 'dashboard'
  const showFavorites = activeTab === 'favorites'
  const showRequests = activeTab === 'requests'
  const showViews = activeTab === 'views'

  return (
    <div className="page-enter" style={{ minHeight: '100vh', padding: '16px 20px 60px' }}>
      <main style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="liquid-glass" style={{ padding: '22px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>
              {user.fullName}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              📞 {user.phoneNumber}
              {user.email && <span style={{ marginRight: '12px' }}>✉️ {user.email}</span>}
              {user.telegramId && <span style={{ marginRight: '12px' }}>💬 {user.telegramId}</span>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Link href="/dashboard" style={{
              color: 'var(--text-brand)', fontSize: '13px', padding: '8px 14px',
              borderRadius: '8px', background: activeTab === 'dashboard' ? 'var(--btn-active-bg)' : 'var(--btn-bg)',
              border: `1px solid ${activeTab === 'dashboard' ? 'var(--btn-active-border)' : 'var(--btn-border)'}`,
              textDecoration: 'none',
            }}>
              📊 داشبورد
            </Link>
            <Link href="/dashboard?tab=favorites" style={{
              color: 'var(--text-brand)', fontSize: '13px', padding: '8px 14px',
              borderRadius: '8px', background: activeTab === 'favorites' ? 'var(--btn-active-bg)' : 'var(--btn-bg)',
              border: `1px solid ${activeTab === 'favorites' ? 'var(--btn-active-border)' : 'var(--btn-border)'}`,
              textDecoration: 'none',
            }}>
              ❤️ علاقه‌مندی‌ها
            </Link>
            <Link href="/dashboard?tab=requests" style={{
              color: 'var(--text-brand)', fontSize: '13px', padding: '8px 14px',
              borderRadius: '8px', background: activeTab === 'requests' ? 'var(--btn-active-bg)' : 'var(--btn-bg)',
              border: `1px solid ${activeTab === 'requests' ? 'var(--btn-active-border)' : 'var(--btn-border)'}`,
              textDecoration: 'none',
            }}>
              📋 درخواست‌ها
            </Link>
            <Link href="/dashboard?tab=views" style={{
              color: 'var(--text-brand)', fontSize: '13px', padding: '8px 14px',
              borderRadius: '8px', background: activeTab === 'views' ? 'var(--btn-active-bg)' : 'var(--btn-bg)',
              border: `1px solid ${activeTab === 'views' ? 'var(--btn-active-border)' : 'var(--btn-border)'}`,
              textDecoration: 'none',
            }}>
              👁️ بازدیدها
            </Link>
            <LogoutButton />
          </div>
        </div>

        {showProfile && (
          <div className="dashboard-tab-content liquid-glass" style={{ padding: '18px', marginBottom: '24px' }}>
            <h3 style={{ marginBottom: 8, color: 'var(--section-title)', fontSize: 15 }}>ویرایش پروفایل</h3>
            <EditProfileForm user={{ fullName: user.fullName, email: user.email, telegramId: user.telegramId }} />
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>توجه: شماره تلفن را نمی‌توان تغییر داد.</div>
          </div>
        )}

        {showViews && (
          <div className="dashboard-tab-content" style={{ marginBottom: '32px' }}>
            <RecentViews />
          </div>
        )}

        {showFavorites && (
          <div className="dashboard-tab-content" style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ width: '4px', height: '16px', background: '#ec4899', borderRadius: '2px' }} />
              <h2 style={{ color: 'var(--section-title)', fontSize: '16px', fontWeight: 600 }}>گوشی‌های ذخیره شده</h2>
            </div>

            {favorites.length === 0 ? (
              <div className="liquid-glass" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                هنوز گوشی‌ای ذخیره نکرده‌اید
              </div>
            ) : (
              <div className="phones-grid">
                {favorites.map((fav: typeof favorites[number]) => {
                  const phone = fav.phone
                  const cond = phone.section === 'new_box'
                    ? { label: 'اکبند', color: '#ef4444' }
                    : (conditionLabel[phone.condition] ?? conditionLabel.fair)
                  return (
                    <Link href={`/phones/${phone.id}`} key={fav.id} className="phone-card-link">
                      <div className="phone-card">
                        {phone.images[0]
                          ? <img src={phone.images[0]} alt={phone.model} className="phone-card-img" />
                          : <div className="phone-card-img-placeholder">📱</div>
                        }
                        <div style={{ padding: '10px' }}>
                          <div style={{ color: 'var(--text-brand)', fontSize: '16px', marginBottom: '3px' }}>{phone.brand}</div>
                          <div style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>{phone.model}</div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-price)', fontSize: '16px', fontWeight: 600 }}>
                              {phone.section === 'new_box' ? 'قیمت روز' : `${phone.price.toLocaleString('en-US')} ت`}
                            </span>
                            <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '20px', background: `${cond.color}20`, color: cond.color }}>
                              {cond.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {showRequests && (
          <div className="dashboard-tab-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ width: '4px', height: '16px', background: '#8ab4f8', borderRadius: '2px' }} />
              <h2 style={{ color: 'var(--section-title)', fontSize: '16px', fontWeight: 600 }}>درخواست‌های خرید من</h2>
            </div>

            {requests.length === 0 ? (
              <div className="liquid-glass" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                هنوز درخواست خریدی ثبت نکرده‌اید
              </div>
            ) : (
              <div className="liquid-glass" style={{ overflow: 'hidden' }}>
                {(requests as RequestWithPhone[]).map((req) => (
                  <Link
                    href={`/phones/${req.phone.id}`}
                    key={req.id}
                    className="dashboard-request-item"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 18px', borderBottom: '1px solid var(--card-border)',
                    }}
                  >
                    <div>
                      <div style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600 }}>
                        {req.phone.brand} {req.phone.model}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
                        {new Date(req.createdAt).toLocaleDateString('fa-IR')}
                      </div>
                    </div>
                    <span style={{ color: 'var(--text-price)', fontSize: '14px', fontWeight: 600 }}>
                      {req.phone.section === 'new_box' ? 'قیمت روز' : `${req.phone.price.toLocaleString('en-US')} ت`}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
