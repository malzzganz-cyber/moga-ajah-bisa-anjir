'use client'

import { useState, useEffect, useRef } from 'react'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import AuthGuard from '@/components/AuthGuard'
import LoadingSpinner from '@/components/LoadingSpinner'
import Image from 'next/image'

interface DepositData {
  deposit_id: string
  amount: number
  status: string
  qr_image?: string
}

const AMOUNTS = [10000, 20000, 50000, 100000, 200000, 500000]

export default function DepositPage() {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [deposit, setDeposit] = useState<DepositData | null>(null)
  const [polling, setPolling] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  async function handleCreate() {
    if (!amount || parseInt(amount) < 10000) {
      setError('Minimum deposit Rp 10.000')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`/api/deposit-create?amount=${amount}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setDeposit(data)
      startPolling(data.deposit_id)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Gagal membuat deposit')
    } finally {
      setLoading(false)
    }
  }

  function startPolling(depositId: string) {
    setPolling(true)
    setStatusMsg('Menunggu pembayaran...')
    intervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/deposit-status?deposit_id=${depositId}`)
        const data = await res.json()
        if (data.status === 'success') {
          setStatusMsg('✅ Pembayaran berhasil!')
          setPolling(false)
          clearInterval(intervalRef.current!)
          setDeposit((prev) => prev ? { ...prev, status: 'success' } : prev)
        }
      } catch { /* continue polling */ }
    }, 5000)

    setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        setPolling(false)
        setStatusMsg('⏰ Waktu habis. Coba cek status manual.')
      }
    }, 60000)
  }

  async function handleCancel() {
    if (!deposit) return
    try {
      await fetch(`/api/deposit-cancel?deposit_id=${deposit.deposit_id}`)
      setDeposit(null)
      setPolling(false)
      if (intervalRef.current) clearInterval(intervalRef.current)
      setStatusMsg('')
    } catch { /* ignore */ }
  }

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current) }, [])

  return (
    <AuthGuard>
      <TopBar title="Deposit Saldo" showBack />
      <div className="px-5 py-4 pb-24 space-y-4 animate-slide-up">

        {!deposit ? (
          <>
            <div className="card">
              <h2 className="text-sm font-bold text-textMain mb-3">Pilih Nominal</h2>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {AMOUNTS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAmount(String(a))}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      amount === String(a)
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-textMain border-border hover:border-primary'
                    }`}
                  >
                    {(a / 1000).toFixed(0)}rb
                  </button>
                ))}
              </div>
              <label className="text-xs font-medium text-textSub mb-1 block">Atau masukkan nominal</label>
              <input
                type="number"
                className="input-field"
                placeholder="Minimal 10.000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl p-3">{error}</div>
            )}

            <div className="bg-secondary rounded-xl p-3 flex items-center gap-3">
              <span className="text-2xl">📱</span>
              <div>
                <p className="text-xs font-semibold text-primary">Pembayaran via QRIS</p>
                <p className="text-xs text-textSub">Scan QR di app e-wallet favorit kamu</p>
              </div>
            </div>

            <button onClick={handleCreate} disabled={loading} className="btn-primary flex items-center justify-center gap-2">
              {loading ? <LoadingSpinner size="sm" /> : '💳'}
              {loading ? 'Membuat QR...' : 'Buat QRIS Deposit'}
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="card text-center">
              <p className="text-xs text-textSub mb-1">Nominal Deposit</p>
              <p className="text-2xl font-bold text-textMain mb-3">
                Rp {deposit.amount?.toLocaleString('id-ID')}
              </p>
              {deposit.qr_image && (
                <div className="flex justify-center mb-3">
                  <div className="border-2 border-primary rounded-xl p-2 inline-block">
                    <Image
                      src={deposit.qr_image}
                      alt="QRIS Code"
                      width={200}
                      height={200}
                      className="rounded-lg"
                      unoptimized
                    />
                  </div>
                </div>
              )}
              <p className="text-xs text-textSub">Scan QR ini untuk membayar</p>
            </div>

            <div className={`card flex items-center gap-3 ${
              deposit.status === 'success' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
            }`}>
              {polling && <LoadingSpinner size="sm" />}
              <div>
                <p className="text-xs font-semibold text-textMain">
                  {deposit.status === 'success' ? '✅ Berhasil' : 'Status Pembayaran'}
                </p>
                <p className="text-xs text-textSub">{statusMsg || `ID: ${deposit.deposit_id}`}</p>
              </div>
            </div>

            {deposit.status !== 'success' && (
              <button onClick={handleCancel} className="btn-outline">
                ❌ Batalkan Deposit
              </button>
            )}

            {deposit.status === 'success' && (
              <button onClick={() => { setDeposit(null); setAmount('') }} className="btn-primary">
                ✅ Deposit Lagi
              </button>
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </AuthGuard>
  )
}
