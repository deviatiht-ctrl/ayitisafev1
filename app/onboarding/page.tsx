'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, MapPin, Bell, Shield } from 'lucide-react'
import Image from 'next/image'
import { useAuthStore } from '@/lib/auth-store'

const SLIDES = [
  {
    bg: 'bg-background',
    titleColor: 'text-[#1B2A4A]',
    bodyColor: 'text-[#64748B]',
    icon: MapPin,
    iconBg: 'bg-[#E2E8F0]',
    title: 'Konnen Zòn Ou',
    body: 'Wè an tan reyèl ki zòn ki danjere epi ki zòn ki sekirize nan Ayiti grasa entèlijans atifisyèl nou an.',
  },
  {
    bg: 'bg-background',
    titleColor: 'text-[#1B2A4A]',
    bodyColor: 'text-[#64748B]',
    icon: Bell,
    iconBg: 'bg-[#FFF7ED]',
    title: 'Resevwa Alèt Imedyat',
    body: 'IA nou an avèti ou otomatikman lè gen tire, barikad, oswa aksidan nan wout ou pral pran an.',
    chips: ['⚡ Tan Reyèl', '🤖 IA', '📍 Pre Ou'],
  },
  {
    bg: 'bg-[#1B2A4A]',
    titleColor: 'text-white',
    bodyColor: 'text-[#CBD5E1]',
    icon: Shield,
    iconBg: 'bg-accent/20',
    title: 'Rapòte, Pwoteje, Sove Lavi',
    body: 'Rapòte ensidan anonimman. Pataje alèt ak fanmi w. Aktive mòd kamouflaj si ou nan danje.',
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { setHasLaunched } = useAuthStore()
  const [current, setCurrent] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const isLast = current === SLIDES.length - 1

  const goTo = useCallback((idx: number) => {
    setCurrent(idx)
    scrollRef.current?.scrollTo({ left: idx * window.innerWidth, behavior: 'smooth' })
  }, [])

  const finish = () => {
    setHasLaunched(true)
  }

  const handleSkip = () => {
    finish()
    router.replace('/login')
  }

  const handleNext = () => {
    if (!isLast) goTo(current + 1)
  }

  const handleBack = () => {
    if (current > 0) goTo(current - 1)
  }

  const handleRegister = () => { finish(); router.replace('/register') }
  const handleLogin = () => { finish(); router.replace('/login') }
  const handleGuest = () => {
    finish()
    useAuthStore.getState().setGuestMode(true)
    router.replace('/guest')
  }

  const slide = SLIDES[current]

  return (
    <div className={`fixed inset-0 ${slide.bg} transition-colors duration-500 flex flex-col`}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-[env(safe-area-inset-top,12px)] pb-2 z-10">
        {current > 0 ? (
          <button onClick={handleBack} className="p-1">
            <ArrowLeft className={`w-6 h-6 ${isLast ? 'text-white' : 'text-[#1B2A4A]'}`} />
          </button>
        ) : (
          <div className="w-6" />
        )}
        <button onClick={handleSkip}>
          <span className={`text-[15px] font-medium ${isLast ? 'text-white' : 'text-[#64748B]'}`}>Pase</span>
        </button>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Logo + Icon illustration */}
        <div className="rounded-2xl overflow-hidden shadow-lg mb-4">
          <Image src="/LOGO.jpg" alt="AyitiSafe" width={140} height={46} className="object-contain" priority />
        </div>
        <div className={`w-28 h-28 rounded-full ${slide.iconBg} flex items-center justify-center mb-8`}>
          <slide.icon className="w-14 h-14 text-accent" strokeWidth={1.2} />
        </div>

        <h2 className={`text-[28px] font-bold text-center mb-4 ${slide.titleColor}`}>
          {slide.title}
        </h2>
        <p className={`text-[15px] text-center leading-relaxed mb-6 max-w-xs ${slide.bodyColor}`}>
          {slide.body}
        </p>

        {slide.chips && (
          <div className="flex gap-2 mb-6">
            {slide.chips.map((chip, i) => (
              <span key={i} className="bg-[#1B2A4A] text-white text-xs font-medium px-3 py-1.5 rounded-full">
                {chip}
              </span>
            ))}
          </div>
        )}

        {isLast && (
          <span className="bg-accent text-white text-[13px] font-medium px-4 py-1.5 rounded-full">
            ✓ 100% Anonimman
          </span>
        )}
      </div>

      {/* Bottom area */}
      <div className="px-8 pb-24">
        {!isLast ? (
          <button
            onClick={handleNext}
            className="w-full h-[52px] bg-accent text-white font-semibold text-base rounded-[14px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            Pwochen <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleRegister}
              className="w-full h-[52px] bg-accent text-white font-semibold text-base rounded-[14px] active:scale-[0.98] transition-transform"
            >
              Kreye Kont Mwen
            </button>
            <button
              onClick={handleLogin}
              className="w-full h-[52px] border-[1.5px] border-white text-white font-semibold text-base rounded-[14px] active:scale-[0.98] transition-transform"
            >
              Mwen gen yon kont
            </button>
            <button onClick={handleGuest} className="mt-1">
              <span className="text-accent text-sm font-medium">Kontinye kòm Envite</span>
            </button>
          </div>
        )}
      </div>

      {/* Dots */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-1.5">
        {SLIDES.map((_, i) => (
          <span
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? 'w-6 bg-accent' : 'w-2 bg-[#CBD5E1]/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
