import { useState } from 'react'
import { lazy, Suspense } from 'react'
import { Users } from 'lucide-react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { BottomNavigation } from '../components/navigation/BottomNavigation'
import { ActiveSosPanel } from '../components/sos/ActiveSosPanel'
import { HomePage } from '../pages/HomePage'
import { FeaturePage } from '../pages/FeaturePage'
import { AuthoritiesPage } from '../pages/AuthoritiesPage'
import { ProfilePage } from '../pages/ProfilePage'
const MapPage = lazy(() => import('../pages/MapPage').then((module) => ({ default: module.MapPage })))
import type { SosState } from '../types/sos'

export default function App() {
  const [sosState, setSosState] = useState<SosState>('idle')
  const startSos = () => setSosState('demo-active')

  const resetSos = () => {
    setSosState('idle')
  }

  return (
    <main className="app-shell" aria-label="Beacon safety app">
      <div className="app-frame">
        {sosState === 'idle' && (
          <Routes>
            <Route path="/" element={<HomePage onStartSos={startSos} />} />
            <Route path="/map" element={<Suspense fallback={<div className="route-loading" role="status">Loading map…</div>}><MapPage /></Suspense>} />
            <Route path="/community" element={<FeaturePage title="Community" description="Verified local updates and discussions will appear here when community services are connected." icon={Users} />} />
            <Route path="/authorities" element={<AuthoritiesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
        {sosState === 'demo-active' && <ActiveSosPanel onEnd={resetSos} />}
        {sosState === 'idle' && <BottomNavigation />}
        <span className="home-indicator" aria-hidden="true" />
      </div>
    </main>
  )
}
