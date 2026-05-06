'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import TopBar from '@/components/TopBar'
import AuthGuard from '@/components/AuthGuard'
import LoadingSpinner from '@/components/LoadingSpinner'

interface BalanceData { balance?: number; [key: string]: unknown }
interface H2hProduct { id?: string; name?: string; bank_code?: string; [key: string]: unknown }
interface WithdrawStatus { status?: string; [key: string]: unknown }

const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID || 'k7ImnQ5eSwVDVJsL4hTRW9HSyRl1'

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [balance, setBalance] = useState<BalanceData | null>(null)
  const [products, setProducts] = useState<H2hProduct[]>([])
  const [target, setTarget] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [withdrawResult, setWithdrawResult] = useState<WithdrawStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<'balance' | 'withdraw'>('balance')

  const isAdmin = user?.uid === ADMIN_UID

  useEffect(() => {
    if (!isAdmin) return
    fetchBalance()
    fetchProducts()
  }, [isAdmin])

  async function fetchBalance() {
    try {
      const res = await fetch('/api/admin-balance')
      setBalance(await res.json())
    } catch { /* ignore */ }
  }

  async function fetchProducts() {
    try {
      const res = await fetch('/api/h2h-product')
      const data = await res.json()
      setProducts(Array.isArray(data) ? data : data.data || [])
    } catch { /* ignore */ }
  }

  async function handleWithdraw(e: React.FormEvent) {
    e.preventDefault()
    if (!target || !selectedId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/h2h-create?target=${encodeURIComponent(target)}&id=${selectedId}`)
      setWithdrawResult(await res.json())
    } catch { /* ignore */ } finally {
      setLoading(false)
    }
  }

  if (!isAdmin) {
    return (
      <AuthGuard>
        <TopBar title="Admin Panel" showBack backHref="/dashboard" />
        <div className="flex flex-col items-center justify-center py-24 px-5 text-center">
          <div className="text-5xl mb-4">🔒</div>
          <p className="text-base font-bold text-textMain mb-1">Akses Ditolak</p>
          <p className="text-xs text-textSub mb-4">Kamu tidak memiliki akses ke panel admin.</p>
          <button onClick={() => router.push('/dashboard')} className="btn-primary max-w-[200px]">
            Kembali ke Dashboard
          </button>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <TopBar title="⚙️ Admin Panel" showBack backHref="/dashboard" />
      <div className="px-5 py-4 pb-24 animate-slide-up">
        {/* Tabs */}
        <div className="flex bg-secondary rounded-xl p-1 mb-4">
          {(['balance', 'withdraw'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                tab === t ? 'bg-white text-primary shadow-sm' : 'text-textSub'
              }`}
            >
              {t === 'balance' ? '💼 Balance' : '💸 Withdraw'}
            </button>
          ))}
        </div>

        {/* BALANCE */}
        {tab === 'balance' && (
          <div className="space-y-4">
            <div className="card bg-gradient-to-r from-primary to-blue-700 border-0 text-white">
              <p className="text-xs text-blue-200 mb-1">Saldo Admin (RumahOTP)</p>
              {balance ? (
                <p className="text-3xl font-bold">
                  Rp {Number(balance.balance ?? 0).toLocaleString('id-ID')}
                </p>
              ) : (
                <LoadingSpinner size="md" />
              )}
              <p className="text-blue-200 text-xs mt-1">Real-time dari API RumahOTP</p>
            </div>
            <button onClick={fetchBalance} className="btn-secondary">
              🔄 Refresh Saldo
            </button>

            {balance && (
              <div className="card">
                <p className="text-xs font-bold text-textMain mb-2">Raw Response</p>
                <pre className="text-[10px] text-textSub overflow-auto bg-gray-50 rounded-lg p-3 max-h-40">
                  {JSON.stringify(balance, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* WITHDRAW */}
        {tab === 'withdraw' && (
          <div className="space-y-4">
            <form onSubmit={handleWithdraw} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-textSub mb-1 block">Target (No. Rekening/e-wallet)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Contoh: 081234567890"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-textSub mb-1 block">Produk / Bank</label>
                <select
                  className="input-field"
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  required
                >
                  <option value="">Pilih produk...</option>
                  {products.map((p, i) => (
                    <option key={i} value={p.id || p.bank_code || String(i)}>
                      {p.name || p.bank_code || `Produk ${i + 1}`}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2">
                {loading ? <LoadingSpinner size="sm" /> : '💸'}
                {loading ? 'Memproses...' : 'Kirim Withdraw'}
              </button>
            </form>

            {withdrawResult && (
              <div className="card">
                <p className="text-xs font-bold text-textMain mb-2">Hasil Withdraw</p>
                <div className={`text-xs font-semibold px-2 py-1 rounded-lg inline-block mb-2 ${
                  withdrawResult.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {String(withdrawResult.status || 'unknown')}
                </div>
                <pre className="text-[10px] text-textSub overflow-auto bg-gray-50 rounded-lg p-3 max-h-40">
                  {JSON.stringify(withdrawResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </AuthGuard>
  )
}
