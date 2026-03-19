'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AppFlowState = 'splash' | 'onboarding' | 'auth' | 'guest' | 'app' | 'calculator'

interface AuthState {
  hasLaunched: boolean
  userToken: string | null
  guestMode: boolean
  camouflageActive: boolean
  appState: AppFlowState
  setHasLaunched: (v: boolean) => void
  setUserToken: (token: string | null) => void
  setGuestMode: (v: boolean) => void
  setCamouflageActive: (v: boolean) => void
  setAppState: (s: AppFlowState) => void
  logout: () => void
  resolveInitialState: () => AppFlowState
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      hasLaunched: false,
      userToken: null,
      guestMode: false,
      camouflageActive: false,
      appState: 'splash',
      setHasLaunched: (v) => set({ hasLaunched: v }),
      setUserToken: (token) => set({ userToken: token }),
      setGuestMode: (v) => set({ guestMode: v }),
      setCamouflageActive: (v) => set({ camouflageActive: v }),
      setAppState: (s) => set({ appState: s }),
      logout: () => set({ userToken: null, guestMode: false, appState: 'auth' }),
      resolveInitialState: () => {
        const { camouflageActive, hasLaunched, guestMode, userToken } = get()
        if (camouflageActive) return 'calculator'
        if (!hasLaunched) return 'onboarding'
        if (guestMode) return 'guest'
        if (!userToken) return 'auth'
        return 'app'
      },
    }),
    {
      name: 'ayitisafe-auth',
    }
  )
)
