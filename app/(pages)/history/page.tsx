'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { useAuth } from '@/lib/auth-context'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import AuthGuard from '@/components/AuthGuard'
import LoadingSpinner from '@/components/LoadingSpinner'

interface HistoryItem {
  id: string
  type: 'order' | 'deposit'
  amount?: number
  number?: string
  otp?: string
  status: string
  createdAt: { toDate: () => Date }
}

export default function HistoryPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'all' | 'order' | 'deposit'>('all')

  useEffect(() => {
    if (!user) return
    fetchHistory()
  }, [user])

  async function fetchHistory() {
    setLoading(true)
    try {
      const q = query(
        collection(db, 'transactions'),
        where('uid', '==', user!.uid),
        orderBy('createdAt', 'desc'),
        limit(50)
      )
      const snap = await getDocs(q)
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as HistoryItem[]
      setItems(data)
    } catch {
      // If no data yet, show empty state
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = tab === 'all' ? items : items.filter((i) => i.type === tab)

  return (
    <AuthGuard>
      <TopBar title="Riwayat Transaksi" showBack />
      <div className="px-5 py-4 pb-24 animate-slide-up">
        {/* Tabs */}
        <div className="flex bg-secondary rounded-xl p-1 mb-4">
          {(['all', 'order', 'deposit'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                tab === t ? 'bg-white text-primary shadow-sm' : 'text-textSub'
              }`}
            >
              {t === 'all' ? 'Semua' : t === 'order' ? '📱 Order' : '💰 Deposit'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-sm font-semibold text-textMain mb-1">Belum ada riwayat</p>
            <p className="text-xs text-textSub">Mulai transaksi pertamamu sekarang!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div key={item.id} className="card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${
                    item.type === 'order' ? 'bg-blue-50' : 'bg-green-50'
                  }`}>
                    {item.type === 'order' ? '📱' : '💰'}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-textMain capitalize">{item.type}</p>
                    <p className="text-[10px] text-textSub">
                      {item.number || (item.amount ? `Rp ${Number(item.amount).toLocaleString('id-ID')}` : item.id.slice(0, 8))}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    item.status === 'success' ? 'bg-green-100 text-green-700'
                    : item.status === 'pending' ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </AuthGuard>
  )
}
