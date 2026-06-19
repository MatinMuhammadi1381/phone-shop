/* eslint-disable @next/next/no-img-element */
import { notFound } from 'next/navigation'
import SavePhoneButton from '../../SavePhoneButton'
import ImageGallery from './ImageGallery'
import RequestForm from './RequestForm'
import Reviews from './Reviews'
import RelatedPhones from './RelatedPhones'
import TrackView from '../../TrackView'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function PhonePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const phone = await prisma.phone.findUnique({ where: { id: Number(id) } })

  if (!phone) notFound()

  const user = await getCurrentUser()

  let isSaved = false
  if (user) {
    const favorite = await prisma.favorite.findFirst({
      where: { userId: user.id, phoneId: phone.id },
    })
    isSaved = Boolean(favorite)
  }

  const conditionLabel: Record<string, { label: string; color: string }> = {
    like_new: { label: 'مثل نو', color: '#6fe3a8' },
    good: { label: 'خوب', color: '#60a5fa' },
    fair: { label: 'قابل قبول', color: '#fbbf24' },
  }
  const cond = phone.section === 'new_box'
    ? { label: 'اکبند', color: '#ef4444' }
    : (conditionLabel[phone.condition] ?? conditionLabel.fair)

  const glassCard: React.CSSProperties = {
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '16px',
  }

  return (
    <div className="page-enter" style={{ minHeight: '100vh', padding: '16px 20px 60px' }}>
      {user && <TrackView phoneId={phone.id} />}
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="responsive-phone-grid">

          {/* عکس‌ها */}
          <div>
            <div style={{ ...glassCard, overflow: 'hidden', marginBottom: '10px' }}>
              <ImageGallery images={phone.images} alt={phone.model} />
            </div>
            {phone.description && (
              <div style={{ ...glassCard, padding: '16px 20px', marginTop: '10px' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px', fontWeight: 600 }}>توضیحات</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.8' }}>{phone.description}</p>
              </div>
            )}

            <div className="desktop-only">
              <RelatedPhones phoneId={phone.id} />
            </div>
          </div>

          {/* اطلاعات */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ ...glassCard, padding: '20px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '18px', left: '18px', zIndex: 10 }}>
                <SavePhoneButton phoneId={phone.id} initialSaved={isSaved} isLoggedIn={Boolean(user)} iconOnly />
              </div>
              <div style={{ color: 'var(--text-brand)', fontSize: '13px', marginBottom: '6px' }}>{phone.brand}</div>
              <h1 style={{ color: 'var(--text-primary)', fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>{phone.model}</h1>

              {/* قیمت */}
              {phone.section === 'new_box' ? (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ color: 'var(--text-price)', fontSize: '22px', fontWeight: 700 }}>قیمت روز</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>
                    برای استعلام قیمت درخواست بدید
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--text-price)', fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>
                  {phone.price.toLocaleString('en-US')} تومان
                </div>
              )}

              {/* بج‌ها */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <span style={{
                  fontSize: '12px', padding: '4px 12px', borderRadius: '20px',
                  background: `${cond.color}15`, color: cond.color,
                  border: `1px solid ${cond.color}40`,
                }}>{cond.label}</span>
                {phone.section === 'featured' && (
                  <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px', background: 'rgba(249,115,22,0.1)', color: '#f97316', border: '1px solid rgba(249,115,22,0.3)' }}>⭐ پیشنهادی</span>
                )}
                {phone.section === 'budget' && (
                  <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px', background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>💰 قیمت مناسب</span>
                )}
                {phone.isSold && (
                  <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px', background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' }}>فروخته شده</span>
                )}
              </div>

              {/* مشخصات */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'حافظه', value: phone.storage },
                  { label: 'رم', value: phone.ram },
                  { label: 'رنگ', value: phone.color },
                  { label: 'بازدید', value: `${phone.views} نفر` },
                ].map(item => (
                  <div key={item.label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 0', borderBottom: '1px solid var(--card-border)',
                  }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{item.label}</span>
                    <span style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* فرم درخواست خرید */}
            {!phone.isSold && (
              <RequestForm phoneId={phone.id} />
            )}

            {/* نظرات */}
            <Reviews phoneId={phone.id} isLoggedIn={Boolean(user)} />
          </div>
        </div>

        <div className="mobile-only">
          <RelatedPhones phoneId={phone.id} />
        </div>
      </div>
    </div>
  )
}
