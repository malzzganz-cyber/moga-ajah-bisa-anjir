'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', icon: '🏠', label: 'Home' },
  { href: '/order', icon: '📱', label: 'Order' },
  { href: '/deposit', icon: '💰', label: 'Deposit' },
  { href: '/history', icon: '📋', label: 'History' },
  { href: '/support', icon: '💬', label: 'Support' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-white border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                active ? 'text-primary' : 'text-textSub'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`text-[10px] font-medium ${active ? 'text-primary' : 'text-textSub'}`}>
                {item.label}
              </span>
              {active && <div className="w-1 h-1 rounded-full bg-primary" />}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
