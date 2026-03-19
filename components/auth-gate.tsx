'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'

const PUBLIC_PATHS = ['/splash', '/onboarding', '/login', '/register', '/forgot-password']
const GUEST_PATHS = ['/guest', '/guest/alerts', '/guest/settings']
const APP_PATHS = ['/', '/alerts', '/report', '/profile', '/settings', '/admin', '/calculator']

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { hasLaunched, userToken, guestMode, camouflageActive, setAppState } = useAuthStore()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Small delay to let persisted store hydrate
    const t = setTimeout(() => setReady(true), 50)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!ready) return

    // Calculator / camouflage override
    if (camouflageActive) {
      if (pathname !== '/calculator') router.replace('/calculator')
      setAppState('calculator')
      return
    }

    // First-time user → onboarding
    if (!hasLaunched) {
      if (pathname !== '/splash' && pathname !== '/onboarding') {
        router.replace('/splash')
      }
      setAppState('onboarding')
      return
    }

    // Guest mode
    if (guestMode && !userToken) {
      if (!GUEST_PATHS.includes(pathname) && !PUBLIC_PATHS.includes(pathname)) {
        router.replace('/guest')
      }
      setAppState('guest')
      return
    }

    // Not authenticated
    if (!userToken) {
      if (!PUBLIC_PATHS.includes(pathname)) {
        router.replace('/login')
      }
      setAppState('auth')
      return
    }

    // Authenticated — redirect away from auth pages
    if (PUBLIC_PATHS.includes(pathname) || GUEST_PATHS.includes(pathname)) {
      router.replace('/')
    }
    setAppState('app')
  }, [ready, hasLaunched, userToken, guestMode, camouflageActive, pathname])

  if (!ready) return null

  return <>{children}</>
}
