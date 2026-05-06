'use client'

import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'

interface TopBarProps {
  title: string
  showBack?: boolean
  backHref?: string
  rightAction?: React.ReactNode
}

export default function TopBar({ title, showBack, backHref = '/dashboard', rightAction }: TopBarProps) {
  return (
    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center gap-3">
      {showBack && (
        <Link href={backHref} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-secondary transition-colors">
          <span className="text-lg">←</span>
        </Link>
      )}
      <h1 className="flex-1 font-bold text-textMain text-base">{title}</h1>
      {rightAction}
    </div>
  )
}
