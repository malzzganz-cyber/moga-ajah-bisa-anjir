'use client'

import { ReactNode, useEffect } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-mobile bg-white rounded-t-3xl p-6 pb-8 animate-slide-up shadow-2xl">
        <div className="w-10 h-1 rounded-full bg-border mx-auto mb-4" />
        {title && <h2 className="text-base font-bold text-textMain mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  )
}
