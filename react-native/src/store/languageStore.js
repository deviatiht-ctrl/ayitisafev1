import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLanguageStore = create(
  persist(
    (set, get) => ({
      language: null, // null = not selected yet, 'ht', 'fr', 'en'
      hasSelectedLanguage: false,
      
      setLanguage: (lang) => set({ 
        language: lang, 
        hasSelectedLanguage: true 
      }),
      
      getLanguage: () => get().language || 'ht', // default to Kreyòl
    }),
    {
      name: 'ayitisafe-language',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useLanguageStore;
