'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Eye, EyeOff, Unlock, MessageCircle, Key, Check, Loader2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]

  useEffect(() => {
    if (step === 2 && countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) { setCanResend(true); clearInterval(interval); return 0 }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [step, countdown])

  const maskedPhone = phone ? `+509 ${phone.slice(0, 4)}-${phone.slice(4)}` : ''

  const handleSendCode = () => {
    if (!phone.trim() || phone.length < 8) {
      setErrors({ phone: 'Tanpri antre nimewo telefòn ou' }); return
    }
    setLoading(true); setErrors({})
    setTimeout(() => { setLoading(false); setStep(2); setCountdown(60); setCanResend(false) }, 1000)
  }

  const handleOtpChange = (text: string, index: number) => {
    const val = text.replace(/[^0-9]/g, '')
    const newOtp = [...otp]; newOtp[index] = val; setOtp(newOtp)
    if (val && index < 3) otpRefs[index + 1].current?.focus()
  }

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs[index - 1].current?.focus()
  }

  const handleVerifyCode = () => {
    if (otp.join('').length < 4) { setErrors({ otp: 'Tanpri antre kòd 4 chif la' }); return }
    setErrors({}); setStep(3)
  }

  const handleResend = () => { setCanResend(false); setCountdown(60); setOtp(['', '', '', '']) }

  const handleChangePassword = () => {
    const e: Record<string, string> = {}
    if (newPassword.length < 8) e.newPassword = 'Modpas dwe gen omwen 8 karaktè'
    if (newPassword !== confirmPassword) e.confirmPassword = 'Modpas yo pa menm'
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); router.replace('/login') }, 1000)
  }

  return (
    <div className="min-h-[100dvh] bg-background">
      <div className="flex items-center justify-between px-5 pt-3 mb-2">
        <button onClick={() => step > 1 ? setStep(step - 1) : router.back()}>
          <ArrowLeft className="w-6 h-6 text-[#1B2A4A]" />
        </button>
        <div className="rounded-xl overflow-hidden shadow-md">
          <Image src="/LOGO.jpg" alt="AyitiSafe" width={120} height={40} className="object-contain" priority />
        </div>
        <div className="w-6" />
      </div>

      <div className="mx-5 bg-white rounded-[20px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
        {/* STEP 1 */}
        {step === 1 && (
          <>
            <div className="flex justify-center mb-4">
              <Unlock className="w-12 h-12 text-accent" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-[#1B2A4A] text-center">Rekipere Kont Ou</h2>
            <p className="text-sm text-[#64748B] text-center mt-1 mb-6">Nou ap voye yon kòd verifikasyon</p>

            <label className="text-[13px] font-medium text-[#1B2A4A] mb-1.5 block">Nimewo Telefòn</label>
            <div className={`flex items-center h-[52px] rounded-xl border-[1.5px] px-3.5 ${errors.phone ? 'border-destructive' : 'border-[#E2E8F0] focus-within:border-accent'}`}>
              <span className="text-[15px] font-medium text-[#1B2A4A]">+509</span>
              <div className="w-px h-6 bg-[#E2E8F0] mx-2.5" />
              <input value={phone} onChange={(e) => { setPhone(e.target.value); setErrors({}) }}
                type="tel" placeholder="XXXX-XXXX"
                className="flex-1 text-[15px] bg-transparent outline-none placeholder:text-[#9CA3AF]" />
            </div>
            {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}

            <button onClick={handleSendCode} disabled={loading}
              className="w-full h-[52px] bg-accent text-white font-semibold rounded-[14px] mt-6 flex items-center justify-center disabled:opacity-70">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Voye Kòd'}
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <div className="flex justify-center mb-4">
              <MessageCircle className="w-12 h-12 text-accent" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-[#1B2A4A] text-center">Antre Kòd la</h2>
            <p className="text-sm text-[#64748B] text-center mt-1 mb-6">Kòd 4 chif voye nan {maskedPhone}</p>

            <div className="flex justify-center gap-3">
              {otp.map((digit, i) => (
                <input key={i} ref={otpRefs[i]} value={digit} maxLength={1} inputMode="numeric"
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleOtpKeyDown(e, i)}
                  className={`w-14 h-16 rounded-xl border-[1.5px] text-center text-2xl font-bold outline-none transition-colors ${
                    digit ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]'
                      : i === otp.findIndex((d) => !d) ? 'border-accent'
                      : 'border-[#E2E8F0]'
                  }`}
                />
              ))}
            </div>
            {errors.otp && <p className="text-xs text-destructive mt-2 text-center">{errors.otp}</p>}

            <div className="text-center mt-4">
              {canResend ? (
                <button onClick={handleResend} className="text-[13px] font-semibold text-accent">Voye ankò</button>
              ) : (
                <span className="text-[13px] text-[#9CA3AF]">Voye ankò nan {countdown}s</span>
              )}
            </div>

            <button onClick={handleVerifyCode}
              className="w-full h-[52px] bg-accent text-white font-semibold rounded-[14px] mt-5">
              Konfime Kòd
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <div className="flex justify-center mb-4">
              <Key className="w-12 h-12 text-accent" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-[#1B2A4A] text-center mb-5">Nouvo Modpas</h2>

            <label className="text-[13px] font-medium text-[#1B2A4A] mb-1.5 block">Nouvo Modpas</label>
            <div className={`flex items-center h-[52px] rounded-xl border-[1.5px] px-3.5 ${errors.newPassword ? 'border-destructive' : 'border-[#E2E8F0] focus-within:border-accent'}`}>
              <input value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setErrors((p) => ({ ...p, newPassword: '' })) }}
                type={showNew ? 'text' : 'password'} placeholder="••••••••"
                className="flex-1 text-[15px] bg-transparent outline-none placeholder:text-[#9CA3AF]" />
              <button type="button" onClick={() => setShowNew(!showNew)}>
                {showNew ? <EyeOff className="w-5 h-5 text-[#9CA3AF]" /> : <Eye className="w-5 h-5 text-[#9CA3AF]" />}
              </button>
            </div>
            {errors.newPassword && <p className="text-xs text-destructive mt-1">{errors.newPassword}</p>}

            <label className="text-[13px] font-medium text-[#1B2A4A] mb-1.5 block mt-4">Konfime Modpas</label>
            <div className={`flex items-center h-[52px] rounded-xl border-[1.5px] px-3.5 ${errors.confirmPassword ? 'border-destructive' : 'border-[#E2E8F0] focus-within:border-accent'}`}>
              <input value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: '' })) }}
                type={showConfirm ? 'text' : 'password'} placeholder="••••••••"
                className="flex-1 text-[15px] bg-transparent outline-none placeholder:text-[#9CA3AF]" />
              {confirmPassword.length > 0 && confirmPassword === newPassword && <Check className="w-5 h-5 text-success mr-1" />}
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeOff className="w-5 h-5 text-[#9CA3AF]" /> : <Eye className="w-5 h-5 text-[#9CA3AF]" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>}

            <button onClick={handleChangePassword} disabled={loading}
              className="w-full h-[52px] bg-accent text-white font-semibold rounded-[14px] mt-6 flex items-center justify-center disabled:opacity-70">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Chanje Modpas'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
