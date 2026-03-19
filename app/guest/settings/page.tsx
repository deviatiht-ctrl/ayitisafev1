'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sun, Moon, Info, Bell, Users, EyeOff, ShieldCheck, Lock, Check } from 'lucide-react'
import { GuestBottomNav } from '@/components/guest-bottom-nav'
import { LockedFeatureModal } from '@/components/locked-feature-modal'
import { useAuthStore } from '@/lib/auth-store'

const LANGUAGES = [
  { key: 'kr', label: 'Kreyòl' },
  { key: 'fr', label: 'Français' },
  { key: 'en', label: 'English' },
]

export default function GuestSettingsPage() {
  const router = useRouter()
  const { setGuestMode } = useAuthStore()
  const [showLocked, setShowLocked] = useState(false)
  const [language, setLanguage] = useState('kr')
  const [darkMode, setDarkMode] = useState(false)

  const handleLogoutGuest = () => {
    if (confirm('Ou vle kite mòd envite a?')) {
      setGuestMode(false)
      router.replace('/login')
    }
  }

  return (
    <main className="min-h-[100dvh] bg-background pb-20">
      <div className="px-5 pt-5 pb-3">
        <h1 className="text-[28px] font-bold text-[#1B2A4A]">Paramèt</h1>
      </div>

      {/* General */}
      <div className="px-5 mt-2">
        <p className="text-[13px] font-semibold text-[#9CA3AF] uppercase mb-2">Jeneral</p>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-[13px] font-medium text-[#1B2A4A] mb-2">Lang</p>
          <div className="flex gap-2 mb-4">
            {LANGUAGES.map((l) => (
              <button key={l.key} onClick={() => setLanguage(l.key)}
                className={`flex-1 py-2 rounded-[10px] text-[13px] font-medium transition-colors ${
                  language === l.key ? 'bg-accent text-white' : 'bg-[#F4F6F9] text-[#64748B]'
                }`}>
                {l.label}
              </button>
            ))}
          </div>

          {/* Dark mode */}
          <button onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center justify-between py-3.5 border-t border-[#F4F6F9]">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-[22px] h-[22px] text-[#1B2A4A]" /> : <Sun className="w-[22px] h-[22px] text-[#1B2A4A]" />}
              <span className="text-[15px] text-[#1B2A4A]">{darkMode ? 'Mòd Fènwa' : 'Mòd Klè'}</span>
            </div>
            <div className={`w-11 h-6 rounded-full transition-colors ${darkMode ? 'bg-accent' : 'bg-[#E2E8F0]'}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow mt-0.5 transition-transform ${darkMode ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
            </div>
          </button>

          {/* About */}
          <button className="w-full flex items-center justify-between py-3.5 border-t border-[#F4F6F9]">
            <div className="flex items-center gap-3">
              <Info className="w-[22px] h-[22px] text-[#1B2A4A]" />
              <span className="text-[15px] text-[#1B2A4A]">Konsènan AyitiSafe</span>
            </div>
          </button>
        </div>
      </div>

      {/* Locked settings */}
      <div className="px-5 mt-5">
        <p className="text-[13px] font-semibold text-[#9CA3AF] uppercase mb-2">Kont</p>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          {[
            { icon: Bell, label: 'Notifikasyon' },
            { icon: Users, label: 'Kontak Dijans' },
            { icon: EyeOff, label: 'Mòd Kamouflaj' },
            { icon: ShieldCheck, label: 'Pwivasi' },
          ].map((item, i) => (
            <button key={i} onClick={() => setShowLocked(true)}
              className={`w-full flex items-center justify-between py-3.5 ${i > 0 ? 'border-t border-[#F4F6F9]' : ''}`}>
              <div className="flex items-center gap-3">
                <item.icon className="w-[22px] h-[22px] text-[#CBD5E1]" />
                <span className="text-[15px] text-[#CBD5E1]">{item.label}</span>
                <Lock className="w-3 h-3 text-[#9CA3AF]" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Upgrade card */}
      <div className="mx-5 mt-6 bg-[#FFF7ED] border border-accent/20 rounded-[20px] p-6">
        <h3 className="text-lg font-bold text-[#1B2A4A]">Debloke Tout AyitiSafe</h3>
        <p className="text-[13px] text-[#64748B] mt-1 mb-4">Kreye yon kont gratis pou aksede tout fonksyon yo</p>
        <div className="flex flex-col gap-2 mb-5">
          {['Alèt pèsonalize', 'Rapòte ensidan', 'Wout sekirize', 'Mòd Kamouflaj'].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              <span className="text-[13px] text-[#1B2A4A]">{item}</span>
            </div>
          ))}
        </div>
        <button onClick={() => router.push('/register')}
          className="w-full h-[52px] bg-accent text-white font-semibold rounded-[14px] mb-2.5">
          Kreye Kont Gratis
        </button>
        <button onClick={() => router.push('/login')}
          className="w-full h-[52px] border-[1.5px] border-[#1B2A4A] text-[#1B2A4A] font-semibold rounded-[14px]">
          Konekte
        </button>
      </div>

      {/* Logout guest */}
      <button onClick={handleLogoutGuest} className="w-full mt-6 mb-8">
        <span className="text-sm font-medium text-destructive">Dékonekte Mòd Envite</span>
      </button>

      <GuestBottomNav />
      <LockedFeatureModal open={showLocked} onClose={() => setShowLocked(false)} />
    </main>
  )
}
