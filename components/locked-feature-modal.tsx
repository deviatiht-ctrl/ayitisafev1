'use client'

import { useRouter } from 'next/navigation'
import { Lock, Check, X } from 'lucide-react'

const FEATURES = [
  'Rapòte ensidan',
  'Resevwa alèt pèsonalize',
  'Wout sekirite pèsonèl',
  'Kontak dijans',
  'Nivo sekirite ou',
]

export function LockedFeatureModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()

  if (!open) return null

  const handleRegister = () => { onClose(); router.push('/register') }
  const handleLogin = () => { onClose(); router.push('/login') }

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-end" onClick={onClose}>
      <div className="w-full bg-white rounded-t-3xl p-8 pb-10 flex flex-col items-center animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="w-10 h-1 rounded-full bg-[#E2E8F0] mb-5" />

        <div className="w-24 h-24 rounded-full bg-[#F4F6F9] flex items-center justify-center mb-5">
          <Lock className="w-14 h-14 text-[#1B2A4A]" strokeWidth={1.3} />
        </div>

        <h3 className="text-[22px] font-bold text-[#1B2A4A] mb-2">Fonksyon Rezève</h3>
        <p className="text-sm text-[#64748B] text-center leading-relaxed mb-5">
          Fonksyon sa a disponib sèlman pou manm ki gen kont. Kreye yon kont gratis pou jwi tout benefis AyitiSafe.
        </p>

        <div className="w-full flex flex-col gap-2.5 mb-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <Check className="w-5 h-5 text-success flex-shrink-0" />
              <span className="text-[13px] text-[#1B2A4A]">{f}</span>
            </div>
          ))}
        </div>

        <button onClick={handleRegister}
          className="w-full h-[52px] bg-accent text-white font-semibold rounded-[14px] mb-2.5 active:scale-[0.98] transition-transform">
          Kreye Kont Gratis
        </button>
        <button onClick={handleLogin}
          className="w-full h-[52px] border-[1.5px] border-[#1B2A4A] text-[#1B2A4A] font-semibold rounded-[14px] mb-3 active:scale-[0.98] transition-transform">
          Konekte
        </button>
        <button onClick={onClose}>
          <span className="text-xs text-[#94A3B8]">Kontinye kòm Envite</span>
        </button>
      </div>
    </div>
  )
}
