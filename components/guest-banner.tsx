'use client'

import Link from 'next/link'
import { Eye } from 'lucide-react'

export function GuestBanner() {
  return (
    <div className="bg-gradient-to-r from-[#1B2A4A] to-[#243452] h-11 flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-2">
        <Eye className="w-4 h-4 text-white" />
        <span className="text-xs font-medium text-white">Mòd Envite — Aksè Limite</span>
      </div>
      <Link
        href="/register"
        className="bg-accent text-white text-[11px] font-semibold px-3 py-1 rounded-full"
      >
        Kreye Kont
      </Link>
    </div>
  )
}
