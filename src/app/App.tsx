import { useState } from 'react'
import { MapPinned, Users } from 'lucide-react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { BottomNavigation } from '../components/navigation/BottomNavigation'
import { ActiveSosPanel } from '../components/sos/ActiveSosPanel'
import { HomePage } from '../pages/HomePage'
import { FeaturePage } from '../pages/FeaturePage'
import { AuthoritiesPage } from '../pages/AuthoritiesPage'
import { ProfilePage } from '../pages/ProfilePage'
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
            <Route path="/map" element={<FeaturePage title="Map" description="Live safety incidents will appear here after the map service is connected." icon={MapPinned} />} />
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
