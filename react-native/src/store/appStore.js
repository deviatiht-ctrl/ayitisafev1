import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Camouflage store - persisted
export const useCamouflageStore = create(
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
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Main app store
export const useAppStore = create((set) => ({
  // App flow state machine
  appFlowState: 'splash',
  setAppFlowState: (state) => set({ appFlowState: state }),

  // Camouflage
  isCamouflageActive: false,
  setIsCamouflageActive: (active) => set({ isCamouflageActive: active }),
  
  // Map filters
  activeFilter: 'all',
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  
  // Selected zone
  selectedZone: null,
  setSelectedZone: (zone) => set({ selectedZone: zone }),
  
  // Alert banner
  showAlertBanner: true,
  setShowAlertBanner: (show) => set({ showAlertBanner: show }),
  
  // Dark mode
  darkMode: false,
  setDarkMode: (dark) => set({ darkMode: dark }),
  
  // Current location
  userLocation: null,
  setUserLocation: (location) => set({ userLocation: location }),
}));

export default useAppStore;
