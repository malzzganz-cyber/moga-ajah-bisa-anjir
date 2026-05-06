'use client'

import { useState } from 'react'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import AuthGuard from '@/components/AuthGuard'

const faqs = [
  {
    q: 'Berapa minimum deposit?',
    a: 'Minimum deposit adalah Rp 10.000. Kamu bisa deposit melalui QRIS dari berbagai e-wallet.',
  },
  {
    q: 'Berapa lama OTP masuk?',
    a: 'OTP biasanya masuk dalam 30 detik hingga 2 menit tergantung layanan yang dipilih.',
  },
  {
    q: 'Apakah saldo bisa refund?',
    a: 'Saldo yang sudah di-deposit tidak dapat di-refund. Pastikan kamu membeli layanan yang tepat.',
  },
  {
    q: 'Bagaimana jika OTP tidak masuk?',
    a: 'Kamu bisa coba order ulang dengan nomor berbeda. Hubungi support jika masalah berlanjut.',
  },
  {
    q: 'Layanan apa saja yang tersedia?',
    a: 'Tersedia berbagai layanan OTP dari banyak negara dan operator. Cek halaman Order untuk daftarnya.',
  },
]

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <AuthGuard>
      <TopBar title="Bantuan & Support" showBack />
      <div className="px-5 py-4 pb-24 space-y-4 animate-slide-up">

        {/* Contact */}
        <div className="card bg-primary text-white border-0">
          <p className="text-xs font-medium mb-1 text-blue-200">Support 24/7</p>
          <p className="text-base font-bold mb-3">Ada masalah? Hubungi kami!</p>
          <div className="flex gap-2">
            <a
              href="https://t.me/malzznokos"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold py-2.5 rounded-xl text-center transition-all"
            >
              ✈️ Telegram
            </a>
            <a
              href="https://wa.me/62xxxxxxxxxx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold py-2.5 rounded-xl text-center transition-all"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-sm font-bold text-textMain mb-3">Pertanyaan Umum (FAQ)</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="card">
                <button
                  className="w-full text-left flex items-center justify-between gap-2"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-xs font-semibold text-textMain">{faq.q}</span>
                  <span className={`text-primary transition-transform duration-200 flex-shrink-0 ${openFaq === i ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {openFaq === i && (
                  <p className="text-xs text-textSub mt-2 pt-2 border-t border-border leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="card bg-secondary border-0">
          <p className="text-xs font-semibold text-primary mb-1">📢 Jam Operasional</p>
          <p className="text-xs text-textSub">Support aktif 24 jam / 7 hari seminggu. Response time rata-rata {'<'} 5 menit.</p>
        </div>
      </div>
      <BottomNav />
    </AuthGuard>
  )
}
