'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CamouflageState {
  isActive: boolean
  pin: string
  setActive: (active: boolean) => void
  setPin: (pin: string) => void
  verifyPin: (input: string) => boolean
}

interface AppState {
  activeFilter: string
  setActiveFilter: (filter: string) => void
  selectedZone: number | null
  setSelectedZone: (zoneId: number | null) => void
  showAlertBanner: boolean
  setShowAlertBanner: (show: boolean) => void
  darkMode: boolean
  setDarkMode: (dark: boolean) => void
}

export const useCamouflageStore = create<CamouflageState>()(
  persist(
    (set, get) => ({
      isActive: false,
      pin: '2580',
      setActive: (active) => set({ isActive: active }),
      setPin: (pin) => set({ pin }),
      verifyPin: (input) => get().pin === input,
    }),
    {
      name: 'ayitisafe-camouflage',
    }
  )
)

export const useAppStore = create<AppState>()((set) => ({
  activeFilter: 'all',
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  selectedZone: null,
  setSelectedZone: (zoneId) => set({ selectedZone: zoneId }),
  showAlertBanner: true,
  setShowAlertBanner: (show) => set({ showAlertBanner: show }),
  darkMode: false,
  setDarkMode: (dark) => set({ darkMode: dark }),
}))
