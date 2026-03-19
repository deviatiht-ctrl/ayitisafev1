'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { 
  ArrowLeft, 
  ArrowRight, 
  MapPin, 
  Camera, 
  Check,
  X,
  Crosshair
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { IncidentTypeGrid } from '@/components/incident-type-grid'
import { cn } from '@/lib/utils'

// Dynamic import for mini map
const MiniMap = dynamic(
  () => import('@/components/mini-map').then((mod) => mod.MiniMap),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[220px] bg-muted rounded-xl flex items-center justify-center">
        <span className="text-muted-foreground text-sm">Chaje kat la...</span>
      </div>
    )
  }
)

const steps = [
  { id: 1, title: 'Lokalite', description: 'Kote ensidan an ye?' },
  { id: 2, title: 'Tip Ensidan', description: 'Ki kalite ensidan?' },
  { id: 3, title: 'Detay', description: 'Dekri sa ou wè' },
  { id: 4, title: 'Konfirmasyon', description: 'Revize rapò ou' },
]

const severityOptions = [
  { id: 'low', label: 'Ba' },
  { id: 'medium', label: 'Mwayen' },
  { id: 'high', label: 'Wo' },
]

interface ReportData {
  location: { lat: number; lng: number } | null
  address: string
  incidentType: string | null
  description: string
  photos: string[]
  isAnonymous: boolean
  severity: string
}

export default function ReportPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const [reportData, setReportData] = useState<ReportData>({
    location: null,
    address: '',
    incidentType: null,
    description: '',
    photos: [],
    isAnonymous: false,
    severity: 'medium',
  })

  const progress = (currentStep / steps.length) * 100

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return reportData.location !== null
      case 2:
        return reportData.incidentType !== null
      case 3:
        return reportData.description.trim().length > 0
      case 4:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setReportData({
            ...reportData,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            address: 'Pozisyon aktyèl ou',
          })
        },
        () => {
          // Default to Port-au-Prince center
          setReportData({
            ...reportData,
            location: { lat: 18.5392, lng: -72.3288 },
            address: 'Port-au-Prince, Haiti',
          })
        }
      )
    } else {
      setReportData({
        ...reportData,
        location: { lat: 18.5392, lng: -72.3288 },
        address: 'Port-au-Prince, Haiti',
      })
    }
  }

  const handleMapClick = (lat: number, lng: number) => {
    setReportData({
      ...reportData,
      location: { lat, lng },
      address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    })
  }

  const handlePhotoUpload = () => {
    // In real app, would use file input
    const mockPhoto = `https://picsum.photos/200/200?random=${Date.now()}`
    setReportData({
      ...reportData,
      photos: [...reportData.photos, mockPhoto],
    })
  }

  const removePhoto = (index: number) => {
    const newPhotos = [...reportData.photos]
    newPhotos.splice(index, 1)
    setReportData({ ...reportData, photos: newPhotos })
  }

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-success/10 rounded-full">
            <Check className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Mèsi!</h1>
          <p className="text-muted-foreground mb-6">
            Rapò w resevwa. Ekip nou ap analize l.
          </p>
          <Button
            onClick={() => router.push('/')}
            className="w-full bg-accent hover:bg-accent/90"
          >
            Retounen nan Kat
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border pt-safe">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-foreground">Rapòte Ensidan</h1>
              <p className="text-sm text-muted-foreground">
                Etap {currentStep} nan {steps.length}: {steps[currentStep - 1].title}
              </p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      {/* Content */}
      <div className="p-4 pb-32">
        {/* Step 1: Location */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Deplase epeng lan sou kote ensidan an ye
            </p>
            
            <MiniMap
              location={reportData.location}
              onLocationChange={handleMapClick}
            />

            {reportData.address && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-sm text-foreground">{reportData.address}</span>
              </div>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={handleUseMyLocation}
            >
              <Crosshair className="w-4 h-4 mr-2" />
              Itilize pozisyon mwen
            </Button>
          </div>
        )}

        {/* Step 2: Incident Type */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Chwazi tip ensidan an
            </p>
            
            <IncidentTypeGrid
              selectedType={reportData.incidentType}
              onSelect={(type) => setReportData({ ...reportData, incidentType: type })}
            />
          </div>
        )}

        {/* Step 3: Details */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Deskripsyon
              </label>
              <Textarea
                placeholder="Dekri sa ou wè oswa sa ki pase..."
                value={reportData.description}
                onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Foto (opsyonèl)
              </label>
              <div className="flex flex-wrap gap-2">
                {reportData.photos.map((photo, index) => (
                  <div key={index} className="relative w-20 h-20">
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 p-1 bg-destructive text-white rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handlePhotoUpload}
                  className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-border rounded-lg hover:border-accent transition-colors"
                >
                  <Camera className="w-6 h-6 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground">Rapòte anonimman</p>
                <p className="text-xs text-muted-foreground">Non ou pap parèt</p>
              </div>
              <Switch
                checked={reportData.isAnonymous}
                onCheckedChange={(checked) => setReportData({ ...reportData, isAnonymous: checked })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Nivo gravite
              </label>
              <div className="flex gap-2">
                {severityOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setReportData({ ...reportData, severity: option.id })}
                    className={cn(
                      'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all',
                      reportData.severity === option.id
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Revize enfòmasyon yo anvan ou soumèt
            </p>

            <div className="bg-card border border-border rounded-xl p-4 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Kote</p>
                  <p className="text-sm font-medium text-foreground">{reportData.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-accent">!</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tip</p>
                  <p className="text-sm font-medium text-foreground capitalize">{reportData.incidentType}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Deskripsyon</p>
                <p className="text-sm text-foreground">{reportData.description}</p>
              </div>

              {reportData.photos.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Foto</p>
                  <div className="flex gap-2">
                    {reportData.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Anonim</span>
                <span className="font-medium text-foreground">
                  {reportData.isAnonymous ? 'Wi' : 'Non'}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Gravite</span>
                <span className="font-medium text-foreground capitalize">
                  {severityOptions.find(s => s.id === reportData.severity)?.label}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border safe-area-bottom">
        <div className="flex gap-3 max-w-lg mx-auto">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retounen
            </Button>
          )}
          
          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 bg-accent hover:bg-accent/90"
            >
              Kontinye
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-accent hover:bg-accent/90"
            >
              {isSubmitting ? 'Ap soumèt...' : 'Soumèt Rapò'}
              <Check className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}
