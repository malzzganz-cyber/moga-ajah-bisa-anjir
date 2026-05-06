'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import AuthGuard from '@/components/AuthGuard'

const menuItems = [
  { href: '/order', icon: '📱', label: 'Order OTP', desc: 'Beli nomor virtual' },
  { href: '/deposit', icon: '💰', label: 'Deposit', desc: 'Isi saldo QRIS' },
  { href: '/history', icon: '📋', label: 'Riwayat', desc: 'Histori transaksi' },
  { href: '/leaderboard', icon: '🏆', label: 'Leaderboard', desc: 'Top user aktif' },
  { href: '/support', icon: '💬', label: 'Support', desc: 'Bantuan 24 jam' },
  { href: '/admin', icon: '⚙️', label: 'Admin', desc: 'Panel admin' },
]

const stats = [
  { label: 'Total Users', value: '1,247', icon: '👥' },
  { label: 'Total Transaksi', value: '8,932', icon: '💳' },
  { label: 'Total Order', value: '5,614', icon: '📦' },
]

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  async function handleLogout() {
    await logout()
    router.replace('/')
  }

  return (
    <AuthGuard>
      <div className="flex flex-col pb-20">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-blue-700 px-5 pt-10 pb-14 text-white">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-blue-200 text-xs">Selamat datang,</p>
              <h1 className="text-lg font-bold">{user?.displayName || user?.email?.split('@')[0] || 'User'} 👋</h1>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-3 py-1.5 rounded-xl transition-all"
            >
              Keluar
            </button>
          </div>
          <p className="text-blue-200 text-xs mt-0.5">{user?.email}</p>
        </div>

        {/* Stats */}
        <div className="px-5 -mt-8">
          <div className="bg-white rounded-2xl shadow-md border border-border p-4 grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="text-base font-bold text-textMain">{s.value}</div>
                <div className="text-[10px] text-textSub">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div className="px-5 mt-5">
          <h2 className="text-sm font-bold text-textMain mb-3">Menu Utama</h2>
          <div className="grid grid-cols-3 gap-3">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="card flex flex-col items-center text-center gap-1.5 hover:border-primary hover:shadow-md transition-all active:scale-95 p-3"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-semibold text-textMain leading-tight">{item.label}</span>
                <span className="text-[9px] text-textSub leading-tight">{item.desc}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="px-5 mt-5">
          <div className="bg-secondary rounded-xl p-4 flex items-start gap-3">
            <span className="text-xl">ℹ️</span>
            <div>
              <p className="text-xs font-semibold text-primary mb-0.5">Cara Pakai</p>
              <p className="text-xs text-textSub">Deposit saldo → Pilih layanan → Order nomor → Tunggu OTP masuk. Mudah dan cepat!</p>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </AuthGuard>
  )
}
