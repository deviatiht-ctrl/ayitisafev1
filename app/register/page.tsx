'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Eye, EyeOff, Camera, ChevronDown, Check, Info, Loader2, X } from 'lucide-react'
import { useAuthStore } from '@/lib/auth-store'

const DEPARTMENTS = ['Ouest', 'Nord', 'Sud', 'Artibonite', 'Centre', "Grand'Anse", 'Nord-Est', 'Nord-Ouest', 'Sud-Est', 'Nippes']
const RELATIONS = ['Fanmi', 'Zanmi', 'Kòlèg', 'Lòt']

export default function RegisterPage() {
  const router = useRouter()
  const { setUserToken, setHasLaunched, setGuestMode } = useAuthStore()

  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [showDeptPicker, setShowDeptPicker] = useState(false)
  const [showRelPicker, setShowRelPicker] = useState<{ visible: boolean; field: string }>({ visible: false, field: '' })
  const [showTerms, setShowTerms] = useState(false)

  // Step 1
  const [avatar, setAvatar] = useState<string | null>(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [department, setDepartment] = useState('')
  const [neighborhood, setNeighborhood] = useState('')

  // Step 2
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pin, setPin] = useState(['', '', '', ''])
  const pinRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]

  // Step 3
  const [contact1Name, setContact1Name] = useState('')
  const [contact1Phone, setContact1Phone] = useState('')
  const [contact1Relation, setContact1Relation] = useState('')
  const [contact2Name, setContact2Name] = useState('')
  const [contact2Phone, setContact2Phone] = useState('')
  const [contact2Relation, setContact2Relation] = useState('')
  const [shareLocation, setShareLocation] = useState(true)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const fileRef = useRef<HTMLInputElement>(null)

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setAvatar(URL.createObjectURL(file))
  }

  const getPasswordStrength = () => {
    if (!password) return { level: 0, label: '', color: '' }
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    if (score <= 1) return { level: 1, label: 'Fèb', color: 'bg-destructive' }
    if (score <= 2) return { level: 2, label: 'Mwayen', color: 'bg-warning' }
    return { level: 3, label: 'Fò', color: 'bg-success' }
  }

  const validateStep1 = () => {
    const e: Record<string, string> = {}
    if (!fullName.trim()) e.fullName = 'Tanpri antre non konplè ou'
    if (!phone.trim() || phone.length < 8) e.phone = 'Nimewo telefòn sa a pa valid'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e: Record<string, string> = {}
    if (password.length < 8) e.password = 'Modpas dwe gen omwen 8 karaktè'
    if (password !== confirmPassword) e.confirmPassword = 'Modpas yo pa menm'
    if (pin.join('').length !== 4) e.pin = 'PIN dwe gen 4 chif'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep3 = () => {
    const e: Record<string, string> = {}
    if (!contact1Name.trim()) e.contact1Name = 'Tanpri antre non kontak la'
    if (!contact1Phone.trim()) e.contact1Phone = 'Nimewo telefòn sa a pa valid'
    if (!termsAccepted) e.terms = 'Tanpri aksepte kondisyon yo'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2)
    else if (step === 2 && validateStep2()) setStep(3)
  }

  const handleRegister = () => {
    if (!validateStep3()) return
    setUserToken('mock_token_123')
    setHasLaunched(true)
    setGuestMode(false)
    setShowSuccess(true)
  }

  const handleSuccessDismiss = () => {
    setShowSuccess(false)
    router.replace('/')
  }

  const handlePinChange = (text: string, index: number) => {
    const val = text.replace(/[^0-9]/g, '')
    const newPin = [...pin]
    newPin[index] = val
    setPin(newPin)
    if (val && index < 3) pinRefs[index + 1].current?.focus()
  }

  const handlePinKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs[index - 1].current?.focus()
    }
  }

  const strength = getPasswordStrength()

  const stepLabels = ['Enfòmasyon', 'Sekirite', 'Kontak']

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-3">
        <button onClick={() => step > 1 ? setStep(step - 1) : router.back()}>
          <ArrowLeft className="w-6 h-6 text-[#1B2A4A]" />
        </button>
        <div className="rounded-xl overflow-hidden shadow-md">
          <Image src="/LOGO.jpg" alt="AyitiSafe" width={120} height={40} className="object-contain" priority />
        </div>
        <div className="w-6" />
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center px-10 py-5">
        {[1, 2, 3].map((s, i) => (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                step > s ? 'bg-success text-white' : step === s ? 'bg-accent text-white' : 'bg-[#E2E8F0] text-[#9CA3AF]'
              }`}>
                {step > s ? <Check className="w-3.5 h-3.5" /> : s}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${step === s ? 'text-accent' : 'text-[#9CA3AF]'}`}>
                {stepLabels[i]}
              </span>
            </div>
            {i < 2 && <div className={`w-12 h-0.5 mx-1 mb-4 ${step > s ? 'bg-success' : 'bg-[#E2E8F0]'}`} />}
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="mx-5 bg-white rounded-[20px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.08)] mb-10">
        {/* STEP 1 */}
        {step === 1 && (
          <>
            {/* Avatar */}
            <div className="flex justify-center mb-5">
              <button onClick={() => fileRef.current?.click()} className="relative">
                {avatar ? (
                  <img src={avatar} alt="" className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#E2E8F0] flex items-center justify-center">
                    <Camera className="w-8 h-8 text-[#9CA3AF]" />
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white border-2 border-background flex items-center justify-center">
                  <Camera className="w-3.5 h-3.5 text-accent" />
                </div>
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
            </div>

            <label className="text-[13px] font-medium text-[#1B2A4A] mb-1.5 block">Non Konplè</label>
            <input value={fullName} onChange={(e) => { setFullName(e.target.value); setErrors((p) => ({ ...p, fullName: '' })) }}
              placeholder="Jean-Pierre Morales"
              className={`w-full h-[52px] rounded-xl border-[1.5px] px-3.5 text-[15px] outline-none ${errors.fullName ? 'border-destructive' : 'border-[#E2E8F0] focus:border-accent'}`}
            />
            {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}

            <label className="text-[13px] font-medium text-[#1B2A4A] mb-1.5 block mt-4">Nimewo Telefòn</label>
            <div className={`flex items-center h-[52px] rounded-xl border-[1.5px] px-3.5 ${errors.phone ? 'border-destructive' : 'border-[#E2E8F0] focus-within:border-accent'}`}>
              <span className="text-[15px] font-medium text-[#1B2A4A]">+509</span>
              <div className="w-px h-6 bg-[#E2E8F0] mx-2.5" />
              <input value={phone} onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: '' })) }}
                type="tel" placeholder="XXXX-XXXX" className="flex-1 text-[15px] bg-transparent outline-none placeholder:text-[#9CA3AF]" />
            </div>
            {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}

            <label className="text-[13px] font-medium text-[#1B2A4A] mb-1.5 block mt-4">Depatman</label>
            <button onClick={() => setShowDeptPicker(true)}
              className="w-full h-[52px] rounded-xl border-[1.5px] border-[#E2E8F0] px-3.5 flex items-center justify-between">
              <span className={department ? 'text-[15px] text-[#1B2A4A]' : 'text-[15px] text-[#9CA3AF]'}>
                {department || 'Chwazi depatman...'}
              </span>
              <ChevronDown className="w-5 h-5 text-[#9CA3AF]" />
            </button>

            <label className="text-[13px] font-medium text-[#1B2A4A] mb-1.5 block mt-4">Katye / Vwazinaj</label>
            <input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)}
              placeholder="Pétion-Ville, Delmas..."
              className="w-full h-[52px] rounded-xl border-[1.5px] border-[#E2E8F0] px-3.5 text-[15px] outline-none focus:border-accent" />
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <label className="text-[13px] font-medium text-[#1B2A4A] mb-1.5 block">
              Imèl <span className="text-[#9CA3AF] text-xs font-normal">(opsyonèl)</span>
            </label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email"
              placeholder="imel@egzanp.com"
              className="w-full h-[52px] rounded-xl border-[1.5px] border-[#E2E8F0] px-3.5 text-[15px] outline-none focus:border-accent" />

            <label className="text-[13px] font-medium text-[#1B2A4A] mb-1.5 block mt-4">Modpas</label>
            <div className={`flex items-center h-[52px] rounded-xl border-[1.5px] px-3.5 ${errors.password ? 'border-destructive' : 'border-[#E2E8F0] focus-within:border-accent'}`}>
              <input value={password} onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })) }}
                type={showPass ? 'text' : 'password'} placeholder="••••••••"
                className="flex-1 text-[15px] bg-transparent outline-none placeholder:text-[#9CA3AF]" />
              <button type="button" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff className="w-5 h-5 text-[#9CA3AF]" /> : <Eye className="w-5 h-5 text-[#9CA3AF]" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
            {password.length > 0 && (
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3].map((lvl) => (
                  <div key={lvl} className={`flex-1 h-1 rounded-full ${lvl <= strength.level ? strength.color : 'bg-[#E2E8F0]'}`} />
                ))}
                <span className={`text-[11px] font-medium ml-1.5 ${strength.level === 1 ? 'text-destructive' : strength.level === 2 ? 'text-warning' : 'text-success'}`}>
                  {strength.label}
                </span>
              </div>
            )}

            <label className="text-[13px] font-medium text-[#1B2A4A] mb-1.5 block mt-4">Konfime Modpas</label>
            <div className={`flex items-center h-[52px] rounded-xl border-[1.5px] px-3.5 ${errors.confirmPassword ? 'border-destructive' : 'border-[#E2E8F0] focus-within:border-accent'}`}>
              <input value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: '' })) }}
                type={showConfirm ? 'text' : 'password'} placeholder="••••••••"
                className="flex-1 text-[15px] bg-transparent outline-none placeholder:text-[#9CA3AF]" />
              {confirmPassword.length > 0 && confirmPassword === password && <Check className="w-5 h-5 text-success mr-1" />}
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeOff className="w-5 h-5 text-[#9CA3AF]" /> : <Eye className="w-5 h-5 text-[#9CA3AF]" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>}

            <label className="text-[13px] font-medium text-[#1B2A4A] mb-1.5 block mt-5">PIN Kamouflaj (4 chif)</label>
            <div className="flex justify-center gap-3 mt-2">
              {pin.map((digit, i) => (
                <input key={i} ref={pinRefs[i]} value={digit} maxLength={1} inputMode="numeric"
                  onChange={(e) => handlePinChange(e.target.value, i)}
                  onKeyDown={(e) => handlePinKeyDown(e, i)}
                  className={`w-14 h-16 rounded-xl border-[1.5px] text-center text-2xl font-bold outline-none transition-colors ${
                    digit ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]' : errors.pin ? 'border-destructive' : 'border-[#E2E8F0] focus:border-accent'
                  }`}
                />
              ))}
            </div>
            <p className="flex items-center justify-center gap-1 text-xs text-[#9CA3AF] mt-2">
              <Info className="w-3.5 h-3.5" /> Kòd sa a pou dezaktive kamouflaj la
            </p>
            {errors.pin && <p className="text-xs text-destructive mt-1 text-center">{errors.pin}</p>}
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h3 className="text-xl font-bold text-[#1B2A4A]">Kontak Dijans</h3>
            <p className="text-sm text-[#64748B] mt-1 mb-4">Moun pou avèti si ou nan danje</p>

            <label className="text-[13px] font-medium text-[#1B2A4A] mb-1.5 block">Non Kontak 1</label>
            <input value={contact1Name} onChange={(e) => { setContact1Name(e.target.value); setErrors((p) => ({ ...p, contact1Name: '' })) }}
              placeholder="Non kontak..."
              className={`w-full h-[52px] rounded-xl border-[1.5px] px-3.5 text-[15px] outline-none ${errors.contact1Name ? 'border-destructive' : 'border-[#E2E8F0] focus:border-accent'}`} />
            {errors.contact1Name && <p className="text-xs text-destructive mt-1">{errors.contact1Name}</p>}

            <label className="text-[13px] font-medium text-[#1B2A4A] mb-1.5 block mt-3">Nimewo Telefòn</label>
            <input value={contact1Phone} onChange={(e) => { setContact1Phone(e.target.value); setErrors((p) => ({ ...p, contact1Phone: '' })) }}
              type="tel" placeholder="XXXX-XXXX"
              className={`w-full h-[52px] rounded-xl border-[1.5px] px-3.5 text-[15px] outline-none ${errors.contact1Phone ? 'border-destructive' : 'border-[#E2E8F0] focus:border-accent'}`} />
            {errors.contact1Phone && <p className="text-xs text-destructive mt-1">{errors.contact1Phone}</p>}

            <label className="text-[13px] font-medium text-[#1B2A4A] mb-1.5 block mt-3">Relasyon</label>
            <button onClick={() => setShowRelPicker({ visible: true, field: 'contact1' })}
              className="w-full h-[52px] rounded-xl border-[1.5px] border-[#E2E8F0] px-3.5 flex items-center justify-between">
              <span className={contact1Relation ? 'text-[15px] text-[#1B2A4A]' : 'text-[15px] text-[#9CA3AF]'}>
                {contact1Relation || 'Chwazi relasyon...'}
              </span>
              <ChevronDown className="w-5 h-5 text-[#9CA3AF]" />
            </button>

            <div className="h-px bg-[#E2E8F0] my-5" />

            <label className="text-[13px] font-medium text-[#1B2A4A] mb-1.5 block">
              Non Kontak 2 <span className="text-[#9CA3AF] text-xs font-normal">(opsyonèl)</span>
            </label>
            <input value={contact2Name} onChange={(e) => setContact2Name(e.target.value)}
              placeholder="Non kontak..."
              className="w-full h-[52px] rounded-xl border-[1.5px] border-[#E2E8F0] px-3.5 text-[15px] outline-none focus:border-accent" />

            <label className="text-[13px] font-medium text-[#1B2A4A] mb-1.5 block mt-3">Nimewo Telefòn</label>
            <input value={contact2Phone} onChange={(e) => setContact2Phone(e.target.value)}
              type="tel" placeholder="XXXX-XXXX"
              className="w-full h-[52px] rounded-xl border-[1.5px] border-[#E2E8F0] px-3.5 text-[15px] outline-none focus:border-accent" />

            <label className="text-[13px] font-medium text-[#1B2A4A] mb-1.5 block mt-3">Relasyon</label>
            <button onClick={() => setShowRelPicker({ visible: true, field: 'contact2' })}
              className="w-full h-[52px] rounded-xl border-[1.5px] border-[#E2E8F0] px-3.5 flex items-center justify-between">
              <span className={contact2Relation ? 'text-[15px] text-[#1B2A4A]' : 'text-[15px] text-[#9CA3AF]'}>
                {contact2Relation || 'Chwazi relasyon...'}
              </span>
              <ChevronDown className="w-5 h-5 text-[#9CA3AF]" />
            </button>

            {/* Share location toggle */}
            <div className="flex items-center justify-between mt-5 py-2">
              <span className="text-sm text-[#1B2A4A] flex-1 mr-3">Pataje pozisyon mwen ak kontak dijans</span>
              <button onClick={() => setShareLocation(!shareLocation)}
                className={`w-11 h-6 rounded-full transition-colors ${shareLocation ? 'bg-accent' : 'bg-[#E2E8F0]'}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${shareLocation ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
              </button>
            </div>

            {/* Terms */}
            <button onClick={() => setTermsAccepted(!termsAccepted)} className="flex items-center gap-2.5 mt-4">
              <div className={`w-[22px] h-[22px] rounded flex items-center justify-center border-2 ${
                termsAccepted ? 'bg-accent border-accent' : 'border-[#E2E8F0]'
              }`}>
                {termsAccepted && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className="text-[13px] text-[#64748B] text-left">
                Mwen dakò ak{' '}
                <span className="text-accent underline" onClick={(e) => { e.stopPropagation(); setShowTerms(true) }}>
                  Kondisyon Itilizasyon yo
                </span>
              </span>
            </button>
            {errors.terms && <p className="text-xs text-destructive mt-1">{errors.terms}</p>}
          </>
        )}

        {/* Action button */}
        {step < 3 ? (
          <button onClick={handleNext}
            className="w-full h-[52px] bg-accent text-white font-semibold text-base rounded-[14px] mt-6 active:scale-[0.98] transition-transform">
            Kontinye →
          </button>
        ) : (
          <button onClick={handleRegister} disabled={!termsAccepted}
            className={`w-full h-[52px] font-semibold text-base rounded-[14px] mt-6 transition-all active:scale-[0.98] ${
              termsAccepted ? 'bg-accent text-white' : 'bg-[#CBD5E1] text-white cursor-not-allowed'
            }`}>
            Kreye Kont Mwen
          </button>
        )}
      </div>

      {/* Department Picker Modal */}
      {showDeptPicker && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end" onClick={() => setShowDeptPicker(false)}>
          <div className="w-full bg-white rounded-t-3xl p-6 pb-10 max-h-[70dvh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-[#E2E8F0] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#1B2A4A] mb-2">Chwazi Depatman</h3>
            {DEPARTMENTS.map((d) => (
              <button key={d} onClick={() => { setDepartment(d); setShowDeptPicker(false) }}
                className={`w-full flex items-center justify-between py-3.5 border-b border-[#F4F6F9] ${department === d ? 'bg-[#FFF7ED]' : ''}`}>
                <span className={`text-[15px] ${department === d ? 'text-accent font-medium' : 'text-[#1B2A4A]'}`}>{d}</span>
                {department === d && <Check className="w-5 h-5 text-accent" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Relation Picker Modal */}
      {showRelPicker.visible && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end" onClick={() => setShowRelPicker({ visible: false, field: '' })}>
          <div className="w-full bg-white rounded-t-3xl p-6 pb-10" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-[#E2E8F0] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#1B2A4A] mb-2">Chwazi Relasyon</h3>
            {RELATIONS.map((r) => {
              const current = showRelPicker.field === 'contact1' ? contact1Relation : contact2Relation
              return (
                <button key={r} onClick={() => {
                  if (showRelPicker.field === 'contact1') setContact1Relation(r)
                  else setContact2Relation(r)
                  setShowRelPicker({ visible: false, field: '' })
                }}
                  className={`w-full flex items-center justify-between py-3.5 border-b border-[#F4F6F9] ${current === r ? 'bg-[#FFF7ED]' : ''}`}>
                  <span className={`text-[15px] ${current === r ? 'text-accent font-medium' : 'text-[#1B2A4A]'}`}>{r}</span>
                  {current === r && <Check className="w-5 h-5 text-accent" />}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-6 pb-10 max-h-[80dvh] overflow-y-auto">
            <div className="w-10 h-1 rounded-full bg-[#E2E8F0] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#1B2A4A] mb-3">Kondisyon Itilizasyon</h3>
            <p className="text-sm text-[#64748B] leading-relaxed whitespace-pre-line">
              {`Byenveni nan AyitiSafe. Lè ou itilize aplikasyon sa a, ou dakò ak kondisyon sa yo:

1. Pwoteksyon Done: Nou respekte vi prive ou. Enfòmasyon pèsonèl ou yo pwoteje epi nou pa pataje yo ak pèsonn san konsantman ou.

2. Itilizasyon App la: Ou aksepte itilize app la pou rezon legal sèlman. Fo rapò ka mennen nan sispansyon kont ou.

3. Anonimite: Rapò ensidan yo rete anonim. Okenn lòt itilizatè pa ka wè ki moun ki fè rapò a.

4. Lokalizasyon: Nou itilize pozisyon ou sèlman pou bay alèt sekirite ki enpòtan pou ou. Ou ka dezaktive sa nenpòt lè.

5. Kontak Dijans: Enfòmasyon kontak dijans ou yo estoke an sekirite epi yo itilize sèlman lè ou aktive fonksyon dijans lan.

6. Mòd Kamouflaj: Fonksyon sa a fèt pou pwoteje ou nan sitiyasyon danjere. Itilize li ak responsablite.

Pa itilize AyitiSafe, ou rekonèt ou te li epi ou dakò ak tout kondisyon sa yo.`}
            </p>
            <button onClick={() => setShowTerms(false)}
              className="w-full h-[52px] bg-accent text-white font-semibold rounded-[14px] mt-4">
              Fèmen
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-6">
          <div className="w-full bg-white rounded-3xl p-8 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-success flex items-center justify-center animate-[bounceIn_0.5s_ease-out] mb-5">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#1B2A4A] text-center">Byenveni nan AyitiSafe! 🎉</h3>
            <p className="text-[15px] text-[#64748B] text-center mt-2 mb-6">Kont ou kreye avèk siksè.</p>
            <div className="w-full bg-[#FFF7ED] border-l-4 border-accent rounded-lg p-3.5 mb-6">
              <p className="text-[13px] text-[#64748B] leading-relaxed">
                💡 Konsèy: Toujou verifye zòn avan ou vwayaje nan Port-au-Prince ak nan lòt vil yo.
              </p>
            </div>
            <button onClick={handleSuccessDismiss}
              className="w-full h-[52px] bg-accent text-white font-semibold rounded-[14px] active:scale-[0.98] transition-transform">
              Kòmanse Itilize App la
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
