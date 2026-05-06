# Malzz Nokos

Platform OTP & Layanan Digital Premium

## Setup

1. Clone project ini
2. Jalankan `npm install`
3. Copy `.env.example` ke `.env.local` dan isi dengan kredensial kamu
4. Jalankan `npm run dev`

## Deploy ke Vercel

1. Push ke GitHub
2. Import di [vercel.com](https://vercel.com)
3. Tambahkan Environment Variables dari `.env.local`
4. Deploy!

## Environment Variables

```
RUMAHOTP_API_KEY=           # API key dari RumahOTP
FIREBASE_PROJECT_ID=        # Firebase Project ID (admin)
FIREBASE_CLIENT_EMAIL=      # Firebase service account email
FIREBASE_PRIVATE_KEY=       # Firebase private key
ADMIN_UID=                  # Firebase UID untuk akses admin panel

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_PLATFORM_FEE=0.05
```

## Fitur

- ✅ Login & Register via Firebase Auth
- ✅ Dashboard dengan statistik
- ✅ Deposit via QRIS (RumahOTP API)
- ✅ Order nomor OTP (service → country → operator → OTP)
- ✅ Riwayat transaksi
- ✅ Leaderboard user
- ✅ Support & FAQ
- ✅ Admin Panel (balance + withdraw)
- ✅ UI Soft Elegant mobile-first (max 420px)
- ✅ Real API - tidak ada data dummy
