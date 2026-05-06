'use client'

import { useState, useEffect, useRef } from 'react'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import AuthGuard from '@/components/AuthGuard'
import LoadingSpinner from '@/components/LoadingSpinner'

type Step = 'service' | 'country' | 'operator' | 'ordered' | 'otp'

interface Service { id: string; name: string; price: number }
interface Country { name: string; provider_id: string }
interface Operator { id: string; name: string }
interface OrderResult { order_id: string; number: string; status: string }
interface OtpResult { otp: string; status: string }

export default function OrderPage() {
  const [step, setStep] = useState<Step>('service')
  const [services, setServices] = useState<Service[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [operators, setOperators] = useState<Operator[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null)
  const [order, setOrder] = useState<OrderResult | null>(null)
  const [otp, setOtp] = useState<OtpResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [pollingOtp, setPollingOtp] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetchServices()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  async function fetchServices() {
    setLoading(true)
    try {
      const res = await fetch('/api/services')
      const data = await res.json()
      setServices(Array.isArray(data) ? data : data.data || [])
    } catch { setError('Gagal memuat layanan') } finally { setLoading(false) }
  }

  async function fetchCountries(serviceId: string) {
    setLoading(true); setError('')
    try {
      const res = await fetch(`/api/countries?service_id=${serviceId}`)
      const data = await res.json()
      setCountries(Array.isArray(data) ? data : data.data || [])
      setStep('country')
    } catch { setError('Gagal memuat negara') } finally { setLoading(false) }
  }

  async function fetchOperators(country: string, providerId: string) {
    setLoading(true); setError('')
    try {
      const res = await fetch(`/api/operators?country=${encodeURIComponent(country)}&provider_id=${providerId}`)
      const data = await res.json()
      setOperators(Array.isArray(data) ? data : data.data || [])
      setStep('operator')
    } catch { setError('Gagal memuat operator') } finally { setLoading(false) }
  }

  async function placeOrder(operator: Operator) {
    if (!selectedService || !selectedCountry) return
    setLoading(true); setError('')
    try {
      const params = new URLSearchParams({
        number_id: selectedService.id,
        provider_id: selectedCountry.provider_id,
        operator_id: operator.id,
      })
      const res = await fetch(`/api/order?${params}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setOrder(data)
      setStep('ordered')
      startOtpPolling(data.order_id)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Gagal membuat order')
    } finally { setLoading(false) }
  }

  function startOtpPolling(orderId: string) {
    setPollingOtp(true)
    intervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/order-status?order_id=${orderId}`)
        const data = await res.json()
        if (data.otp) {
          setOtp(data)
          setStep('otp')
          setPollingOtp(false)
          clearInterval(intervalRef.current!)
        }
      } catch { /* continue */ }
    }, 5000)
    setTimeout(() => {
      clearInterval(intervalRef.current!)
      setPollingOtp(false)
    }, 60000)
  }

  async function cancelOrder() {
    if (!order) return
    try {
      await fetch(`/api/order-status?order_id=${order.order_id}`)
    } catch { /* ignore */ }
    resetAll()
  }

  function resetAll() {
    setStep('service'); setOrder(null); setOtp(null)
    setSelectedService(null); setSelectedCountry(null); setSelectedOperator(null)
    setPollingOtp(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  function copyNumber(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AuthGuard>
      <TopBar title="Order Nomor OTP" showBack />
      {/* Steps indicator */}
      <div className="px-5 py-3">
        <div className="flex items-center gap-1">
          {(['service', 'country', 'operator', 'ordered', 'otp'] as Step[]).map((s, i) => {
            const steps: Step[] = ['service', 'country', 'operator', 'ordered', 'otp']
            const currentIdx = steps.indexOf(step)
            const thisIdx = steps.indexOf(s)
            return (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${thisIdx <= currentIdx ? 'bg-primary' : 'bg-border'}`} />
                {i < 4 && <div className={`flex-1 h-0.5 ${thisIdx < currentIdx ? 'bg-primary' : 'bg-border'}`} />}
              </div>
            )
          })}
        </div>
        <div className="flex justify-between mt-1">
          {['Layanan','Negara','Operator','Order','OTP'].map((l) => (
            <span key={l} className="text-[9px] text-textSub">{l}</span>
          ))}
        </div>
      </div>

      <div className="px-5 pb-24 animate-slide-up">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl p-3 mb-3">{error}</div>
        )}

        {/* STEP: SERVICE */}
        {step === 'service' && (
          <div className="space-y-2">
            <p className="text-sm font-bold text-textMain mb-2">Pilih Layanan</p>
            {loading ? (
              <div className="flex justify-center py-10"><LoadingSpinner size="lg" /></div>
            ) : services.length === 0 ? (
              <div className="card text-center text-textSub text-sm py-8">Tidak ada layanan tersedia</div>
            ) : (
              services.map((svc) => (
                <button
                  key={svc.id}
                  onClick={() => { setSelectedService(svc); fetchCountries(svc.id) }}
                  className="card w-full text-left flex items-center justify-between hover:border-primary hover:shadow-md transition-all active:scale-95"
                >
                  <div>
                    <p className="text-sm font-semibold text-textMain">{svc.name}</p>
                    <p className="text-xs text-textSub">ID: {svc.id}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-primary">Rp {Number(svc.price).toLocaleString('id-ID')}</span>
                    <span className="text-lg block">→</span>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* STEP: COUNTRY */}
        {step === 'country' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => setStep('service')} className="text-xs text-primary font-medium">← Layanan</button>
              <p className="text-sm font-bold text-textMain">Pilih Negara</p>
            </div>
            {loading ? (
              <div className="flex justify-center py-10"><LoadingSpinner size="lg" /></div>
            ) : countries.length === 0 ? (
              <div className="card text-center text-textSub text-sm py-8">Tidak ada negara tersedia</div>
            ) : (
              countries.map((c) => (
                <button
                  key={c.provider_id}
                  onClick={() => { setSelectedCountry(c); fetchOperators(c.name, c.provider_id) }}
                  className="card w-full text-left flex items-center justify-between hover:border-primary hover:shadow-md transition-all active:scale-95"
                >
                  <p className="text-sm font-semibold text-textMain">{c.name}</p>
                  <span className="text-lg">→</span>
                </button>
              ))
            )}
          </div>
        )}

        {/* STEP: OPERATOR */}
        {step === 'operator' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => setStep('country')} className="text-xs text-primary font-medium">← Negara</button>
              <p className="text-sm font-bold text-textMain">Pilih Operator</p>
            </div>
            {loading ? (
              <div className="flex justify-center py-10"><LoadingSpinner size="lg" /></div>
            ) : operators.length === 0 ? (
              <div className="card text-center text-textSub text-sm py-8">Tidak ada operator tersedia</div>
            ) : (
              operators.map((op) => (
                <button
                  key={op.id}
                  onClick={() => { setSelectedOperator(op); placeOrder(op) }}
                  className="card w-full text-left flex items-center justify-between hover:border-primary hover:shadow-md transition-all active:scale-95"
                >
                  <div>
                    <p className="text-sm font-semibold text-textMain">{op.name}</p>
                    <p className="text-xs text-textSub">ID: {op.id}</p>
                  </div>
                  <span className="text-lg">→</span>
                </button>
              ))
            )}
            {loading && <div className="flex justify-center py-6"><LoadingSpinner /></div>}
          </div>
        )}

        {/* STEP: ORDERED */}
        {step === 'ordered' && order && (
          <div className="space-y-4">
            <div className="card text-center">
              <p className="text-xs text-textSub mb-1">Nomor Virtual Kamu</p>
              <div className="bg-secondary rounded-xl py-4 px-3 my-2">
                <p className="text-2xl font-bold text-primary tracking-widest">{order.number}</p>
              </div>
              <button
                onClick={() => copyNumber(order.number)}
                className="btn-secondary text-sm mt-1"
              >
                {copied ? '✅ Tersalin!' : '📋 Salin Nomor'}
              </button>
            </div>

            <div className="card flex items-center gap-3 bg-yellow-50 border-yellow-200">
              {pollingOtp && <LoadingSpinner size="sm" />}
              <div>
                <p className="text-xs font-semibold text-textMain">Menunggu OTP...</p>
                <p className="text-xs text-textSub">Order ID: {order.order_id}</p>
              </div>
            </div>

            <button onClick={cancelOrder} className="btn-outline">
              ❌ Batalkan Order
            </button>
          </div>
        )}

        {/* STEP: OTP */}
        {step === 'otp' && otp && (
          <div className="space-y-4">
            <div className="card text-center bg-green-50 border-green-200">
              <p className="text-xs text-green-600 font-medium mb-2">✅ OTP Berhasil Diterima</p>
              <p className="text-xs text-textSub mb-1">Kode OTP</p>
              <div className="bg-white border-2 border-green-400 rounded-2xl py-6 px-4 my-2">
                <p className="text-4xl font-bold text-green-600 tracking-[0.3em]">{otp.otp}</p>
              </div>
              <button
                onClick={() => copyNumber(otp.otp)}
                className="bg-green-500 text-white rounded-xl px-4 py-2.5 text-sm font-semibold w-full hover:bg-green-600 transition-all active:scale-95"
              >
                {copied ? '✅ Tersalin!' : '📋 Salin OTP'}
              </button>
            </div>

            <div className="card">
              <p className="text-xs text-textSub mb-1">Nomor yang digunakan</p>
              <p className="text-base font-bold text-textMain">{order?.number}</p>
            </div>

            <button onClick={resetAll} className="btn-primary">
              🔄 Order Lagi
            </button>
          </div>
        )}
      </div>
      <BottomNav />
    </AuthGuard>
  )
}
