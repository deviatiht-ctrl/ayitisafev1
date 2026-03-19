'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/lib/auth-store'

export default function LoginPage() {
  const router = useRouter()
  const { setUserToken, setHasLaunched, setGuestMode } = useAuthStore()

  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [phoneFocused, setPhoneFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!phone.trim()) e.phone = 'Tanpri antre nimewo telefòn ou'
    if (!password.trim()) e.password = 'Tanpri antre modpas ou'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleLogin = async () => {
    if (!validate()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    if (phone === '0000' && password === '0000') {
      setErrors({ general: 'Nimewo oswa modpas enkòrèk' })
      setLoading(false)
      return
    }
    setUserToken('mock_token_123')
    setHasLaunched(true)
    setGuestMode(false)
    setLoading(false)
    router.replace('/')
  }

  const handleGuest = () => {
    setGuestMode(true)
    setHasLaunched(true)
    router.replace('/guest')
  }

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      {/* Header */}
      <div className="flex flex-col items-center pt-8 pb-2">
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <Image src="/LOGO.jpg" alt="AyitiSafe" width={160} height={52} className="object-contain" priority />
        </div>
        <p className="text-sm text-[#64748B] mt-1">Konekte nan kont ou</p>
      </div>

      {/* Card */}
      <div className="mx-5 mt-4 bg-white rounded-[20px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
        <h2 className="text-2xl font-bold text-[#1B2A4A]">Bon Retou 👋</h2>
        <p className="text-sm text-[#64748B] mt-1 mb-5">Antre enfòmasyon ou yo</p>

        {errors.general && (
          <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg mb-4">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-xs text-destructive">{errors.general}</span>
          </div>
        )}

        {/* Phone */}
        <label className="text-[13px] font-medium text-[#1B2A4A] mb-1.5 block">Nimewo Telefòn</label>
        <div
          className={`flex items-center h-[52px] rounded-xl border-[1.5px] px-3.5 transition-colors ${
            errors.phone ? 'border-destructive' : phoneFocused ? 'border-accent' : 'border-[#E2E8F0]'
          }`}
        >
          <span className="text-[15px] font-medium text-[#1B2A4A]">+509</span>
          <div className="w-px h-6 bg-[#E2E8F0] mx-2.5" />
          <input
            type="tel"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: '' })) }}
            onFocus={() => setPhoneFocused(true)}
            onBlur={() => setPhoneFocused(false)}
            placeholder="XXXX-XXXX"
            className="flex-1 text-[15px] bg-transparent outline-none placeholder:text-[#9CA3AF]"
          />
        </div>
        {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}

        {/* Password */}
        <label className="text-[13px] font-medium text-[#1B2A4A] mb-1.5 block mt-4">Modpas</label>
        <div
          className={`flex items-center h-[52px] rounded-xl border-[1.5px] px-3.5 transition-colors ${
            errors.password ? 'border-destructive' : passwordFocused ? 'border-accent' : 'border-[#E2E8F0]'
          }`}
        >
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })) }}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            placeholder="••••••••"
            className="flex-1 text-[15px] bg-transparent outline-none placeholder:text-[#9CA3AF]"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="p-1">
            {showPassword ? <EyeOff className="w-5 h-5 text-[#9CA3AF]" /> : <Eye className="w-5 h-5 text-[#9CA3AF]" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}

        {/* Forgot */}
        <div className="flex justify-end mt-2 mb-5">
          <Link href="/forgot-password" className="text-[13px] font-medium text-accent">
            Bliye modpas ou?
          </Link>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full h-[52px] bg-accent text-white font-semibold text-base rounded-[14px] flex items-center justify-center disabled:opacity-70 active:scale-[0.98] transition-transform"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Konekte'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#E2E8F0]" />
          <span className="text-[13px] text-[#9CA3AF]">oswa</span>
          <div className="flex-1 h-px bg-[#E2E8F0]" />
        </div>

        {/* Google */}
        <button className="w-full h-[52px] rounded-[14px] border-[1.5px] border-[#E2E8F0] flex items-center justify-center gap-2.5 mb-2.5 active:bg-gray-50 transition-colors">
          <span className="text-xl font-bold text-[#4285F4]">G</span>
          <span className="text-sm font-medium text-[#1B2A4A]">Kontinye ak Google</span>
        </button>
      </div>

      {/* Bottom links */}
      <div className="flex justify-center mt-6">
        <span className="text-sm text-[#64748B]">Pa gen kont? </span>
        <Link href="/register" className="text-sm font-semibold text-accent ml-1">Kreye youn</Link>
      </div>
      <button onClick={handleGuest} className="mx-auto mt-4 mb-8">
        <span className="text-[13px] text-[#94A3B8] underline">Kontinye kòm Envite</span>
      </button>
    </div>
  )
}
