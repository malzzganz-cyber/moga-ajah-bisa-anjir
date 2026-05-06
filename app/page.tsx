'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function HomePage() {
  const { user, login, register, loading } = useAuth()
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (user) {
    router.replace('/dashboard')
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(email, password, displayName)
      }
      router.replace('/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan'
      setError(msg.includes('user-not-found') || msg.includes('wrong-password')
        ? 'Email atau password salah'
        : msg.includes('email-already-in-use')
        ? 'Email sudah terdaftar'
        : 'Terjadi kesalahan, coba lagi')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary to-blue-700 px-6 pt-16 pb-10 text-white">
        <div className="text-4xl mb-3">📱</div>
        <h1 className="text-2xl font-bold mb-1">Malzz Nokos</h1>
        <p className="text-blue-100 text-sm">Platform OTP & Layanan Digital Premium</p>
      </div>

      {/* Auth Card */}
      <div className="flex-1 px-5 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg border border-border p-5 animate-slide-up">
          {/* Tabs */}
          <div className="flex bg-secondary rounded-xl p-1 mb-5">
            {(['login', 'register'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setMode(tab); setError('') }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  mode === tab ? 'bg-white text-primary shadow-sm' : 'text-textSub'
                }`}
              >
                {tab === 'login' ? 'Masuk' : 'Daftar'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <div>
                <label className="text-xs font-medium text-textSub mb-1 block">Nama</label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="Nama lengkap"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-textSub mb-1 block">Email</label>
              <input
                className="input-field"
                type="email"
                placeholder="email@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-textSub mb-1 block">Password</label>
              <input
                className="input-field"
                type="password"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl p-3">
                {error}
              </div>
            )}

            <button type="submit" disabled={submitting} className="btn-primary flex items-center justify-center gap-2 mt-1">
              {submitting ? <LoadingSpinner size="sm" /> : null}
              {mode === 'login' ? 'Masuk' : 'Buat Akun'}
            </button>
          </form>
        </div>

        {/* Testimonials */}
        <div className="mt-6 mb-8">
          <h2 className="text-sm font-bold text-textMain mb-3">⭐ Testimoni Pengguna</h2>
          <div className="space-y-3">
            {testimonials.map((t, i) => (
              <div key={i} className="card">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-primary">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-textMain">{t.name}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <span key={j} className={`text-xs ${j < t.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-textSub">{t.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const testimonials = [
  { name: 'Rizky A', rating: 5, comment: 'Cepat banget! OTP langsung masuk dalam hitungan detik. Recommended!' },
  { name: 'Sari M', rating: 5, comment: 'Deposit QRIS mudah, saldo langsung masuk. Pelayanannya memuaskan.' },
  { name: 'Budi S', rating: 4, comment: 'Nomor tersedia banyak, harga terjangkau. Akan terus pakai layanan ini.' },
]
