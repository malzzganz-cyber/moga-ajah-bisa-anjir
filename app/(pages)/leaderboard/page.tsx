'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import AuthGuard from '@/components/AuthGuard'
import LoadingSpinner from '@/components/LoadingSpinner'

interface LeaderUser {
  id: string
  displayName: string
  email: string
  totalOrder: number
  totalDeposit: number
}

const MEDALS = ['🥇', '🥈', '🥉']

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchLeaderboard() }, [])

  async function fetchLeaderboard() {
    setLoading(true)
    try {
      const q = query(collection(db, 'users'), orderBy('totalOrder', 'desc'), limit(20))
      const snap = await getDocs(q)
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as LeaderUser[])
    } catch {
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard>
      <TopBar title="Leaderboard" showBack />
      <div className="px-5 py-4 pb-24 animate-slide-up">
        <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-4 text-white mb-5 text-center">
          <div className="text-3xl mb-1">🏆</div>
          <p className="font-bold text-base">Top User Aktif</p>
          <p className="text-blue-200 text-xs">Pengguna dengan order terbanyak bulan ini</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="text-4xl mb-3">🏆</div>
            <p className="text-sm font-semibold text-textMain mb-1">Belum ada data</p>
            <p className="text-xs text-textSub">Jadilah yang pertama di leaderboard!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((u, i) => (
              <div key={u.id} className={`card flex items-center gap-3 ${i === 0 ? 'border-yellow-300 bg-yellow-50' : i === 1 ? 'border-gray-300 bg-gray-50' : i === 2 ? 'border-orange-200 bg-orange-50' : ''}`}>
                <div className="w-8 flex-shrink-0 text-center">
                  {i < 3 ? (
                    <span className="text-xl">{MEDALS[i]}</span>
                  ) : (
                    <span className="text-sm font-bold text-textSub">#{i + 1}</span>
                  )}
                </div>
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">
                  {(u.displayName || u.email)?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-textMain truncate">{u.displayName || u.email?.split('@')[0]}</p>
                  <p className="text-[10px] text-textSub">{u.totalOrder || 0} order</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-primary">{u.totalOrder || 0}</p>
                  <p className="text-[10px] text-textSub">order</p>
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
