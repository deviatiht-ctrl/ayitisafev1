'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuthStore } from '@/lib/auth-store'

export default function SplashPage() {
  const router = useRouter()
  const { setHasLaunched } = useAuthStore()
  const [showTitle, setShowTitle] = useState(false)
  const [showSub, setShowSub] = useState(false)
  const [showBadge, setShowBadge] = useState(false)

  useEffect(() => {
    setTimeout(() => setShowTitle(true), 400)
    setTimeout(() => setShowSub(true), 700)
    setTimeout(() => setShowBadge(true), 1000)
    setTimeout(() => {
      router.replace('/onboarding')
    }, 2000)
  }, [router])

  return (
    <div className="fixed inset-0 bg-[#1B2A4A] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-[bounceIn_0.6s_ease-out] rounded-2xl overflow-hidden shadow-lg">
          <Image src="/LOGO.jpg" alt="AyitiSafe" width={180} height={60} className="object-contain" priority />
        </div>

        <p
          className={`mt-2 text-base text-accent transition-all duration-500 ${
            showSub ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Sekirite Entèlijan pou Ayiti
        </p>

        <div
          className={`mt-5 border border-accent rounded-full px-4 py-1.5 transition-all duration-500 ${
            showBadge ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        >
          <span className="text-xs text-accent">✦ Pwoteje pa IA</span>
        </div>
      </div>

      {/* Pulsing dots */}
      <div className="absolute bottom-16 flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-accent/60 animate-pulse"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
