'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { 
  ArrowLeft, 
  AlertTriangle, 
  MapPin, 
  Users, 
  Bell,
  ChevronDown,
  UserCheck
} from 'lucide-react'
import { KPICard } from '@/components/kpi-card'
import { Button } from '@/components/ui/button'
import { dashboardStats, officers, recentIncidents, zones } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'

// Dynamic import for mini map
const AdminMiniMap = dynamic(
  () => import('@/components/admin-mini-map').then((mod) => mod.AdminMiniMap),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[200px] bg-card-dark rounded-xl flex items-center justify-center">
        <span className="text-card-dark-foreground/50 text-sm">Chaje kat la...</span>
      </div>
    )
  }
)

const COLORS = ['#EF4444', '#F97316', '#F59E0B', '#6B7280']

const statusColors: Record<string, string> = {
  pending: 'bg-warning/20 text-warning',
  'in-progress': 'bg-accent/20 text-accent',
  resolved: 'bg-success/20 text-success',
}

const statusLabels: Record<string, string> = {
  pending: 'An Atant',
  'in-progress': 'En Kou',
  resolved: 'Rezoud',
}

const officerStatusColors: Record<string, string> = {
  active: 'bg-success',
  busy: 'bg-warning',
  offline: 'bg-muted-foreground',
}

export default function AdminDashboard() {
  const router = useRouter()
  const [selectedIncident, setSelectedIncident] = useState<number | null>(null)

  const trendData = dashboardStats.incidentTrend.map((value, index) => ({
    day: ['Lun', 'Mad', 'Mèk', 'Jed', 'Van', 'Sam', 'Dim'][index],
    value,
  }))

  return (
    <main className="min-h-screen bg-primary">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-primary border-b border-primary-foreground/10 pt-safe">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-full hover:bg-primary-foreground/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-primary-foreground" />
            </button>
            <h1 className="text-lg font-bold text-primary-foreground">Dashboard Ofisyèl</h1>
          </div>
          <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs font-bold">
            ADMIN
          </span>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3">
          <KPICard
            title="Ensidan Aktif"
            value={dashboardStats.activeIncidents}
            icon={<AlertTriangle className="w-4 h-4 text-destructive" />}
            trend="up"
            trendValue="+12%"
          />
          <KPICard
            title="Zòn Rouj"
            value={dashboardStats.redZones}
            icon={<MapPin className="w-4 h-4 text-destructive" />}
            trend="neutral"
            trendValue="san chanjman"
          />
          <KPICard
            title="Ofisye Aktif"
            value={dashboardStats.activeOfficers}
            icon={<Users className="w-4 h-4 text-success" />}
            trend="down"
            trendValue="-3"
          />
          <KPICard
            title="Alèt Voye"
            value={dashboardStats.alertsSent}
            icon={<Bell className="w-4 h-4 text-accent" />}
            trend="up"
            trendValue="+28%"
          />
        </div>

        {/* Mini Map */}
        <section>
          <h2 className="text-sm font-semibold text-primary-foreground/70 uppercase tracking-wider mb-3">
            Kat Ensidan
          </h2>
          <AdminMiniMap zones={zones} />
        </section>

        {/* Incident Table */}
        <section>
          <h2 className="text-sm font-semibold text-primary-foreground/70 uppercase tracking-wider mb-3">
            Ensidan Resan
          </h2>
          <div className="bg-card-dark rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-card-dark-foreground/10">
                    <th className="text-left p-3 text-card-dark-foreground/70 font-medium">ID</th>
                    <th className="text-left p-3 text-card-dark-foreground/70 font-medium">Kote</th>
                    <th className="text-left p-3 text-card-dark-foreground/70 font-medium">Tip</th>
                    <th className="text-left p-3 text-card-dark-foreground/70 font-medium">Estati</th>
                    <th className="text-left p-3 text-card-dark-foreground/70 font-medium">Aksyon</th>
                  </tr>
                </thead>
                <tbody>
                  {recentIncidents.map((incident) => (
                    <tr 
                      key={incident.id}
                      className="border-b border-card-dark-foreground/5 hover:bg-card-dark-foreground/5"
                    >
                      <td className="p-3 text-card-dark-foreground">#{incident.id}</td>
                      <td className="p-3 text-card-dark-foreground">{incident.location}</td>
                      <td className="p-3 text-card-dark-foreground capitalize">{incident.type}</td>
                      <td className="p-3">
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          statusColors[incident.status]
                        )}>
                          {statusLabels[incident.status]}
                        </span>
                      </td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs bg-transparent border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                          onClick={() => setSelectedIncident(incident.id)}
                        >
                          Asiye Ofisye
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Charts */}
        <section>
          <h2 className="text-sm font-semibold text-primary-foreground/70 uppercase tracking-wider mb-3">
            Tendans Ensidan (7 dènye jou)
          </h2>
          <div className="bg-card-dark rounded-xl p-4 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1B2A4A', 
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#F97316" 
                  strokeWidth={2}
                  dot={{ fill: '#F97316' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3">
          {/* Pie Chart */}
          <section>
            <h2 className="text-sm font-semibold text-primary-foreground/70 uppercase tracking-wider mb-3">
              Distribisyon Zòn
            </h2>
            <div className="bg-card-dark rounded-xl p-4 h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardStats.zoneDistribution}
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dashboardStats.zoneDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1B2A4A', 
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Bar Chart */}
          <section>
            <h2 className="text-sm font-semibold text-primary-foreground/70 uppercase tracking-wider mb-3">
              Pa Kategori
            </h2>
            <div className="bg-card-dark rounded-xl p-4 h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardStats.incidentsByType}>
                  <XAxis dataKey="type" stroke="rgba(255,255,255,0.5)" fontSize={10} />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1B2A4A', 
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px'
                    }} 
                  />
                  <Bar dataKey="count" fill="#F97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* Officer Deployment */}
        <section>
          <h2 className="text-sm font-semibold text-primary-foreground/70 uppercase tracking-wider mb-3">
            Deplwaman Ofisye
          </h2>
          <div className="bg-card-dark rounded-xl overflow-hidden divide-y divide-card-dark-foreground/10">
            {officers.map((officer) => (
              <div 
                key={officer.id}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-card-dark-foreground/10 flex items-center justify-center text-card-dark-foreground font-medium">
                      {officer.name.split(' ').slice(1).map(n => n[0]).join('')}
                    </div>
                    <span className={cn(
                      'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card-dark',
                      officerStatusColors[officer.status]
                    )} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-dark-foreground">{officer.name}</p>
                    <p className="text-xs text-card-dark-foreground/50">{officer.zone}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs bg-transparent border-card-dark-foreground/30 text-card-dark-foreground hover:bg-card-dark-foreground/10"
                  disabled={officer.status === 'offline'}
                >
                  <UserCheck className="w-3 h-3 mr-1" />
                  Deplwaye
                </Button>
              </div>
            ))}
          </div>
        </section>

        <div className="h-8" />
      </div>
    </main>
  )
}
