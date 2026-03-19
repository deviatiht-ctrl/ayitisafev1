'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Moon, 
  Sun, 
  Globe, 
  Bell, 
  MapPin, 
  Shield, 
  AlertTriangle,
  Trash2,
  Eye,
  EyeOff,
  Calculator,
  Check
} from 'lucide-react'
import { BottomNav } from '@/components/bottom-nav'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCamouflageStore, useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const languages = [
  { id: 'ht', label: 'Kreyòl' },
  { id: 'fr', label: 'Français' },
  { id: 'en', label: 'English' },
]

export default function SettingsPage() {
  const router = useRouter()
  const { darkMode, setDarkMode } = useAppStore()
  const { isActive, pin, setActive, setPin } = useCamouflageStore()
  
  const [selectedLanguage, setSelectedLanguage] = useState('ht')
  const [criticalAlerts, setCriticalAlerts] = useState(true)
  const [warningAlerts, setWarningAlerts] = useState(true)
  const [newsAlerts, setNewsAlerts] = useState(false)
  const [shareLocation, setShareLocation] = useState(true)
  const [anonymousReports, setAnonymousReports] = useState(false)
  const [showPinInput, setShowPinInput] = useState(false)
  const [newPin, setNewPin] = useState('')
  const [showPin, setShowPin] = useState(false)

  const handleCamouflageToggle = (checked: boolean) => {
    if (checked && !pin) {
      setShowPinInput(true)
    } else {
      setActive(checked)
      if (checked) {
        router.push('/calculator')
      }
    }
  }

  const handlePinSave = () => {
    if (newPin.length === 4) {
      setPin(newPin)
      setActive(true)
      setShowPinInput(false)
      router.push('/calculator')
    }
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border pt-safe">
        <div className="px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Paramèt</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Appearance Section */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Aparans
          </h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-5 h-5 text-accent" /> : <Sun className="w-5 h-5 text-accent" />}
                <div>
                  <p className="text-sm font-medium text-foreground">Mòd Fènwa</p>
                  <p className="text-xs text-muted-foreground">Chanje aparans aplikasyon an</p>
                </div>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </div>
        </section>

        {/* Language Section */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Lang
          </h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-5 h-5 text-accent" />
                <p className="text-sm font-medium text-foreground">Chwazi lang ou</p>
              </div>
              <div className="flex gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id)}
                    className={cn(
                      'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all',
                      selectedLanguage === lang.id
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    )}
                  >
                    {selectedLanguage === lang.id && <Check className="w-3 h-3 inline mr-1" />}
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Notifikasyon
          </h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-destructive" />
                <div>
                  <p className="text-sm font-medium text-foreground">Alèt Kritik</p>
                  <p className="text-xs text-muted-foreground">Tire, kidnapping, elatriye</p>
                </div>
              </div>
              <Switch checked={criticalAlerts} onCheckedChange={setCriticalAlerts} />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-warning" />
                <div>
                  <p className="text-sm font-medium text-foreground">Alèt Atansyon</p>
                  <p className="text-xs text-muted-foreground">Barikad, manifestasyon</p>
                </div>
              </div>
              <Switch checked={warningAlerts} onCheckedChange={setWarningAlerts} />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Nouvèl Sekirite</p>
                  <p className="text-xs text-muted-foreground">Aktyalite ak konsèy</p>
                </div>
              </div>
              <Switch checked={newsAlerts} onCheckedChange={setNewsAlerts} />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-accent" />
                <p className="text-sm font-medium text-foreground">Radis alèt</p>
              </div>
              <p className="text-xs text-muted-foreground">Pre mwen nan 5km</p>
            </div>
          </div>
        </section>

        {/* Privacy Section */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Pwivasi
          </h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-sm font-medium text-foreground">Pataje Pozisyon Mwen</p>
                  <p className="text-xs text-muted-foreground">Pou alèt ki pre ou</p>
                </div>
              </div>
              <Switch checked={shareLocation} onCheckedChange={setShareLocation} />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-sm font-medium text-foreground">Rapò Anonimman pa Defo</p>
                  <p className="text-xs text-muted-foreground">Non ou pap parèt</p>
                </div>
              </div>
              <Switch checked={anonymousReports} onCheckedChange={setAnonymousReports} />
            </div>
            <button className="flex items-center gap-3 w-full p-4 text-left hover:bg-muted transition-colors">
              <Trash2 className="w-5 h-5 text-destructive" />
              <p className="text-sm font-medium text-destructive">Efase done mwen</p>
            </button>
          </div>
        </section>

        {/* Camouflage Mode Section */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Mòd Kamouflaj
          </h2>
          <div className="bg-primary rounded-xl overflow-hidden">
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <Calculator className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-primary-foreground">
                    Kache app ou a
                  </p>
                  <p className="text-xs text-primary-foreground/70">
                    App la ap parèt tankou yon kalkilatris si ou nan danje
                  </p>
                </div>
              </div>

              {!showPinInput ? (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-primary-foreground">Aktive Kamouflaj</p>
                    <Switch
                      checked={isActive}
                      onCheckedChange={handleCamouflageToggle}
                    />
                  </div>

                  {isActive && (
                    <div className="p-3 bg-warning/20 rounded-lg flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                      <p className="text-xs text-primary-foreground">
                        Kamouflaj aktif — App w ap parèt tankou yon kalkilatris. 
                        Tape PIN ou ({pin}) pou retounen.
                      </p>
                    </div>
                  )}

                  {pin && (
                    <button 
                      onClick={() => setShowPinInput(true)}
                      className="text-xs text-accent underline"
                    >
                      Chanje PIN
                    </button>
                  )}
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-primary-foreground/70 mb-1 block">
                      Antre yon PIN 4 chif
                    </label>
                    <div className="relative">
                      <Input
                        type={showPin ? 'text' : 'password'}
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="____"
                        maxLength={4}
                        className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground text-center text-lg tracking-[0.5em] placeholder:tracking-[0.5em]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-foreground/50"
                      >
                        {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowPinInput(false)
                        setNewPin('')
                      }}
                      className="flex-1 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                    >
                      Anile
                    </Button>
                    <Button
                      size="sm"
                      onClick={handlePinSave}
                      disabled={newPin.length !== 4}
                      className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      Sove PIN
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Version */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">AyitiSafe v1.0.0</p>
          <p className="text-xs text-muted-foreground">Made with care for Haiti</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </main>
  )
}
