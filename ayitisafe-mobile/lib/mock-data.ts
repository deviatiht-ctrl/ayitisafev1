// AyitiSafe Mock Data - Realistic Haitian locations and data

export interface Zone {
  id: number
  name: string
  risk: 'critical' | 'warning' | 'safe'
  color: string
  coordinates: [number, number][]
  center: [number, number]
  lastIncident: string
  aiScore: number
  incidentCount: number
}

export interface Alert {
  id: number
  type: 'shooting' | 'kidnapping' | 'accident' | 'barricade' | 'protest' | 'patrol' | 'road_hazard' | 'flood'
  severity: 'critical' | 'warning' | 'safe'
  title: string
  location: string
  street: string
  time: string
  aiScore: number
  resolved: boolean
}

export interface SafeRoute {
  id: number
  name: string
  from: string
  to: string
  distance: string
  safetyScore: number
  coordinates: [number, number][]
}

export interface User {
  id: number
  name: string
  phone: string
  zone: string
  safetyScore: number
  reportsCount: number
  savedRoutes: number
  alertsReceived: number
  avatar?: string
  role: 'user' | 'admin'
}

export interface Officer {
  id: number
  name: string
  zone: string
  status: 'active' | 'busy' | 'offline'
  avatar?: string
}

export interface Incident {
  id: number
  type: string
  location: string
  severity: 'low' | 'medium' | 'high'
  status: 'pending' | 'in-progress' | 'resolved'
  timestamp: string
  reportedBy?: string
}

// Zone polygon coordinates for Port-au-Prince area
export const zones: Zone[] = [
  {
    id: 1,
    name: 'Cité Soleil',
    risk: 'critical',
    color: '#EF4444',
    coordinates: [
      [18.5812, -72.3464],
      [18.5812, -72.3264],
      [18.5612, -72.3264],
      [18.5612, -72.3464],
    ],
    center: [18.5712, -72.3364],
    lastIncident: 'Tire tande — 1h de sa',
    aiScore: 93,
    incidentCount: 12,
  },
  {
    id: 2,
    name: 'Martissant',
    risk: 'critical',
    color: '#EF4444',
    coordinates: [
      [18.5250, -72.3550],
      [18.5250, -72.3350],
      [18.5050, -72.3350],
      [18.5050, -72.3550],
    ],
    center: [18.5150, -72.3450],
    lastIncident: 'Kidnapping rapòte — 3h de sa',
    aiScore: 88,
    incidentCount: 8,
  },
  {
    id: 3,
    name: 'Pétion-Ville',
    risk: 'safe',
    color: '#22C55E',
    coordinates: [
      [18.5192, -72.3088],
      [18.5192, -72.2788],
      [18.4992, -72.2788],
      [18.4992, -72.3088],
    ],
    center: [18.5092, -72.2938],
    lastIncident: 'Patwouy polis — 30min de sa',
    aiScore: 95,
    incidentCount: 2,
  },
  {
    id: 4,
    name: 'Tabarre',
    risk: 'safe',
    color: '#22C55E',
    coordinates: [
      [18.5561, -72.2983],
      [18.5561, -72.2683],
      [18.5361, -72.2683],
      [18.5361, -72.2983],
    ],
    center: [18.5461, -72.2833],
    lastIncident: 'Trafik nòmal — 1h de sa',
    aiScore: 97,
    incidentCount: 1,
  },
  {
    id: 5,
    name: 'Delmas 33',
    risk: 'warning',
    color: '#F59E0B',
    coordinates: [
      [18.5450, -72.3250],
      [18.5450, -72.3050],
      [18.5250, -72.3050],
      [18.5250, -72.3250],
    ],
    center: [18.5350, -72.3150],
    lastIncident: 'Manifestasyon — 3h de sa',
    aiScore: 72,
    incidentCount: 5,
  },
  {
    id: 6,
    name: 'Delmas 18',
    risk: 'warning',
    color: '#F59E0B',
    coordinates: [
      [18.5550, -72.3350],
      [18.5550, -72.3150],
      [18.5350, -72.3150],
      [18.5350, -72.3350],
    ],
    center: [18.5450, -72.3250],
    lastIncident: 'Tire tande — 23min de sa',
    aiScore: 68,
    incidentCount: 7,
  },
  {
    id: 7,
    name: 'Centre-Ville',
    risk: 'critical',
    color: '#EF4444',
    coordinates: [
      [18.5492, -72.3488],
      [18.5492, -72.3288],
      [18.5292, -72.3288],
      [18.5292, -72.3488],
    ],
    center: [18.5392, -72.3388],
    lastIncident: 'Barikad — 2h de sa',
    aiScore: 85,
    incidentCount: 10,
  },
  {
    id: 8,
    name: 'Carrefour',
    risk: 'warning',
    color: '#F59E0B',
    coordinates: [
      [18.5150, -72.4100],
      [18.5150, -72.3900],
      [18.4950, -72.3900],
      [18.4950, -72.4100],
    ],
    center: [18.5050, -72.4000],
    lastIncident: 'Aksidan — 4h de sa',
    aiScore: 75,
    incidentCount: 4,
  },
]

export const alerts: Alert[] = [
  {
    id: 1,
    type: 'shooting',
    severity: 'critical',
    title: 'Tire tande nan Delmas 18',
    location: 'Delmas 18',
    street: 'Ri Capois',
    time: '23min de sa',
    aiScore: 91,
    resolved: false,
  },
  {
    id: 2,
    type: 'barricade',
    severity: 'warning',
    title: 'Barikad sou wout la',
    location: 'Route Nationale #1',
    street: 'Pre Titanyen',
    time: '1h de sa',
    aiScore: 78,
    resolved: false,
  },
  {
    id: 3,
    type: 'patrol',
    severity: 'safe',
    title: 'Wout lib - Patwouy aktif',
    location: 'Pétion-Ville',
    street: 'Route de Frères',
    time: '2h de sa',
    aiScore: 95,
    resolved: true,
  },
  {
    id: 4,
    type: 'kidnapping',
    severity: 'critical',
    title: 'Kidnapping rapòte',
    location: 'Martissant',
    street: 'Avenue N',
    time: '3h de sa',
    aiScore: 88,
    resolved: false,
  },
  {
    id: 5,
    type: 'protest',
    severity: 'warning',
    title: 'Manifestasyon an kou',
    location: 'Avenue John Brown',
    street: 'Pre HUEH',
    time: '4h de sa',
    aiScore: 82,
    resolved: false,
  },
  {
    id: 6,
    type: 'patrol',
    severity: 'safe',
    title: 'Patwouy polis aktif',
    location: 'Tabarre',
    street: 'Route de Tabarre',
    time: '5h de sa',
    aiScore: 97,
    resolved: true,
  },
  {
    id: 7,
    type: 'shooting',
    severity: 'critical',
    title: 'Tire tande nan Cité Soleil',
    location: 'Cité Soleil',
    street: 'Blok A',
    time: '6h de sa',
    aiScore: 93,
    resolved: false,
  },
  {
    id: 8,
    type: 'accident',
    severity: 'warning',
    title: 'Aksidan vwati',
    location: 'Route de Delmas',
    street: 'Km 4',
    time: '7h de sa',
    aiScore: 75,
    resolved: true,
  },
  {
    id: 9,
    type: 'road_hazard',
    severity: 'warning',
    title: 'Wout glise apre lapli',
    location: 'Delmas 33',
    street: 'Ri Prinsipal',
    time: '2h de sa',
    aiScore: 80,
    resolved: false,
  },
  {
    id: 10,
    type: 'flood',
    severity: 'critical',
    title: 'Potansyèl inondasyon',
    location: 'Tabarre',
    street: 'Bò larivyè',
    time: '1h de sa',
    aiScore: 85,
    resolved: false,
  },
]

export const safeRoutes: SafeRoute[] = [
  {
    id: 1,
    name: 'Tabarre → Pétion-Ville',
    from: 'Tabarre',
    to: 'Pétion-Ville',
    distance: '14.2km',
    safetyScore: 94,
    coordinates: [
      [18.5461, -72.2883],
      [18.5389, -72.2922],
      [18.5320, -72.2960],
      [18.5250, -72.2998],
      [18.5180, -72.2970],
      [18.5092, -72.2938],
    ],
  },
  {
    id: 2,
    name: 'Pétion-Ville → Aéroport',
    from: 'Pétion-Ville',
    to: 'Aéroport Toussaint',
    distance: '8.5km',
    safetyScore: 89,
    coordinates: [
      [18.5092, -72.2938],
      [18.5150, -72.2900],
      [18.5250, -72.2850],
      [18.5350, -72.2800],
      [18.5450, -72.2750],
      [18.5550, -72.2700],
    ],
  },
]

export const currentUser: User = {
  id: 1,
  name: 'Jean-Pierre Morales',
  phone: '+509 3456-7890',
  zone: 'Port-au-Prince, Ouest',
  safetyScore: 78,
  reportsCount: 12,
  savedRoutes: 3,
  alertsReceived: 47,
  role: 'admin',
}

export const officers: Officer[] = [
  { id: 1, name: 'Agent Pierre Louis', zone: 'Pétion-Ville', status: 'active' },
  { id: 2, name: 'Agent Marie Joseph', zone: 'Tabarre', status: 'active' },
  { id: 3, name: 'Agent Jean Baptiste', zone: 'Delmas 33', status: 'busy' },
  { id: 4, name: 'Agent Paul André', zone: 'Centre-Ville', status: 'busy' },
  { id: 5, name: 'Agent Rose Michel', zone: 'Carrefour', status: 'offline' },
]

export const recentIncidents: Incident[] = [
  { id: 1, type: 'shooting', location: 'Delmas 18', severity: 'high', status: 'in-progress', timestamp: '23min de sa' },
  { id: 2, type: 'barricade', location: 'Route Nationale #1', severity: 'medium', status: 'pending', timestamp: '1h de sa' },
  { id: 3, type: 'kidnapping', location: 'Martissant', severity: 'high', status: 'in-progress', timestamp: '3h de sa' },
  { id: 4, type: 'protest', location: 'Avenue John Brown', severity: 'medium', status: 'in-progress', timestamp: '4h de sa' },
  { id: 5, type: 'accident', location: 'Route de Delmas', severity: 'low', status: 'resolved', timestamp: '7h de sa' },
]

export const incidentTypes = [
  { id: 'shooting', icon: 'crosshair', label: 'Tire', color: '#EF4444' },
  { id: 'kidnapping', icon: 'user-x', label: 'Kidnapping', color: '#1B2A4A' },
  { id: 'accident', icon: 'car', label: 'Aksidan', color: '#F97316' },
  { id: 'barricade', icon: 'construction', label: 'Barikad', color: '#F59E0B' },
  { id: 'protest', icon: 'users', label: 'Manifestasyon', color: '#8B5CF6' },
  { id: 'road_hazard', icon: 'alert-triangle', label: 'Wout Danjere', color: '#F59E0B' },
  { id: 'flood', icon: 'droplets', label: 'Inondasyon', color: '#3B82F6' },
  { id: 'fire', icon: 'flame', label: 'Dife', color: '#EF4444' },
  { id: 'other', icon: 'help-circle', label: 'Lòt', color: '#6B7280' },
]

export const emergencyContacts = [
  { id: 1, name: 'Marie Joseph', phone: '+509 3712-xxxx', relation: 'Fanmi' },
  { id: 2, name: 'Police Nasyonal', phone: '114', relation: 'Ijans' },
  { id: 3, name: 'Ponpye', phone: '115', relation: 'Ijans' },
  { id: 4, name: 'Anbilans', phone: '116', relation: 'Ijans' },
]

// Stats for admin dashboard
export const dashboardStats = {
  activeIncidents: 23,
  redZones: 4,
  activeOfficers: 31,
  alertsSent: 147,
  incidentTrend: [12, 15, 18, 14, 20, 23, 19],
  zoneDistribution: [
    { name: 'Cité Soleil', value: 32 },
    { name: 'Martissant', value: 28 },
    { name: 'Delmas', value: 21 },
    { name: 'Lòt', value: 19 },
  ],
  incidentsByType: [
    { type: 'Tire', count: 15 },
    { type: 'Barikad', count: 12 },
    { type: 'Aksidan', count: 8 },
    { type: 'Kidnapping', count: 5 },
    { type: 'Lòt', count: 7 },
  ],
}
