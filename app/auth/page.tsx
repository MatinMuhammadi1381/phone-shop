import { redirect } from 'next/navigation'
import AuthForm from './AuthForm'
import { getCurrentUser } from '@/lib/auth'

export default async function AuthPage() {
  const user = await getCurrentUser()
  if (user) redirect('/dashboard')

  return (
    <div style={{ minHeight: '100vh', padding: '28px 20px 60px' }}>
      <div style={{ textAlign: 'center', marginBottom: '26px' }}>
        <h1 style={{ color: 'var(--text-primary)', fontSize: '32px', fontWeight: 800, marginBottom: '10px' }}>
          T-Mobile
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '18px', fontSize: '15px' }}>
          با Gmail یا شماره تماس وارد شوید و بعد اطلاعات خودتان را در یک فرم ساده کامل کنید.
        </p>
      </div>
      <AuthForm />
    </div>
  )
}
