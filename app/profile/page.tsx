'use client'

import { useRouter } from 'next/navigation'
import { 
  Camera, 
  MapPin, 
  Phone, 
  FileText, 
  Navigation, 
  Bell, 
  ChevronRight,
  LogOut,
  Shield,
  UserPlus
} from 'lucide-react'
import { BottomNav } from '@/components/bottom-nav'
import { SafetyScoreRing } from '@/components/safety-score-ring'
import { Button } from '@/components/ui/button'
import { currentUser, safeRoutes, emergencyContacts, recentIncidents } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const incidentTypeLabels: Record<string, string> = {
  shooting: 'Tire',
  kidnapping: 'Kidnapping',
  accident: 'Aksidan',
  barricade: 'Barikad',
  protest: 'Manifestasyon',
}

const statusColors: Record<string, string> = {
  pending: 'bg-warning text-warning-foreground',
  'in-progress': 'bg-accent text-accent-foreground',
  resolved: 'bg-success text-success-foreground',
}

const statusLabels: Record<string, string> = {
  pending: 'An Atant',
  'in-progress': 'An Kou',
  resolved: 'Rezoud',
}

export default function ProfilePage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary to-primary/90 text-primary-foreground pt-safe">
        <div className="px-4 py-8">
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center text-3xl font-bold">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <button className="absolute -bottom-1 -right-1 p-1.5 bg-accent rounded-full">
                <Camera className="w-3.5 h-3.5 text-accent-foreground" />
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="text-center">
            <h1 className="text-xl font-bold mb-1">{currentUser.name}</h1>
            <div className="flex items-center justify-center gap-1 text-sm text-primary-foreground/80 mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{currentUser.zone}</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-sm text-primary-foreground/80">
              <Phone className="w-3.5 h-3.5" />
              <span>{currentUser.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Score Section */}
      <div className="px-4 -mt-8">
        <div className="bg-card rounded-2xl shadow-lg p-6 text-center">
          <SafetyScoreRing score={currentUser.safetyScore} className="mb-3" />
          <p className="text-sm text-muted-foreground">Nivo Sekirite ou</p>
          
          {/* Stats Row */}
          <div className="flex items-center justify-around mt-6 pt-6 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{currentUser.reportsCount}</p>
              <p className="text-xs text-muted-foreground">Rapò</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{currentUser.savedRoutes}</p>
              <p className="text-xs text-muted-foreground">Wout</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{currentUser.alertsReceived}</p>
              <p className="text-xs text-muted-foreground">Alèt</p>
            </div>
          </div>
        </div>
      </div>

      {/* My Reports */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Rapò Mwen</h2>
          <button className="text-sm text-accent">Wè tout</button>
        </div>
        
        <div className="space-y-2">
          {recentIncidents.slice(0, 3).map((incident) => (
            <div
              key={incident.id}
              className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {incidentTypeLabels[incident.type] || incident.type}
                </p>
                <p className="text-xs text-muted-foreground">{incident.location}</p>
              </div>
              <span className={cn(
                'px-2 py-0.5 rounded-full text-[10px] font-semibold',
                statusColors[incident.status]
              )}>
                {statusLabels[incident.status]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Routes */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Wout Sove</h2>
          <button className="text-sm text-accent">Wè tout</button>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {safeRoutes.map((route) => (
            <div
              key={route.id}
              className="flex-shrink-0 w-64 p-4 bg-card rounded-xl border border-border"
            >
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-foreground">{route.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{route.distance}</span>
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-success" />
                  {route.safetyScore}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Kontak Ijans</h2>
          <button className="text-sm text-accent">Jere</button>
        </div>
        
        <div className="space-y-2">
          {emergencyContacts.slice(0, 2).map((contact) => (
            <div
              key={contact.id}
              className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                <Phone className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{contact.name}</p>
                <p className="text-xs text-muted-foreground">{contact.phone}</p>
              </div>
              <span className="text-xs text-muted-foreground">{contact.relation}</span>
            </div>
          ))}
          
          <button className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-accent hover:text-accent transition-colors">
            <UserPlus className="w-4 h-4" />
            <span className="text-sm">Ajoute Kontak</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-6 space-y-2">
        <button
          onClick={() => router.push('/settings')}
          className="flex items-center gap-3 w-full p-4 bg-card rounded-xl border border-border hover:bg-muted transition-colors"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="flex-1 text-left text-sm font-medium text-foreground">Paramèt</span>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        {currentUser.role === 'admin' && (
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center gap-3 w-full p-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Shield className="w-5 h-5" />
            <span className="flex-1 text-left text-sm font-medium">Dashboard Admin</span>
            <span className="px-2 py-0.5 bg-accent text-accent-foreground rounded text-xs font-bold">
              ADMIN
            </span>
          </button>
        )}

        <button className="flex items-center gap-3 w-full p-4 border border-destructive rounded-xl text-destructive hover:bg-destructive/5 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="flex-1 text-left text-sm font-medium">Dekonekte</span>
        </button>
      </div>

      <div className="h-8" />

      {/* Bottom Navigation */}
      <BottomNav />
    </main>
  )
}
