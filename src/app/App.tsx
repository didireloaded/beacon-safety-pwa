import { useEffect, useState } from 'react'
import { CircleUserRound, MapPinned, Users } from 'lucide-react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { BottomNavigation } from '../components/navigation/BottomNavigation'
import { ActiveSosPanel } from '../components/sos/ActiveSosPanel'
import { SosCountdown } from '../components/sos/SosCountdown'
import { HomePage } from '../pages/HomePage'
import { FeaturePage } from '../pages/FeaturePage'
import { AuthoritiesPage } from '../pages/AuthoritiesPage'
import type { SosState } from '../types/sos'

export default function App() {
  const [sosState, setSosState] = useState<SosState>('idle')
  const [countdown, setCountdown] = useState(5)
  const [deadline, setDeadline] = useState<number | null>(null)

  useEffect(() => {
    if (sosState !== 'countdown' || deadline === null) return
    const updateCountdown = () => {
      const secondsLeft = Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
      setCountdown(secondsLeft)
      if (secondsLeft === 0) {
        setDeadline(null)
        setSosState('demo-active')
      }
    }
    updateCountdown()
    const timer = window.setInterval(updateCountdown, 100)
    return () => window.clearInterval(timer)
  }, [deadline, sosState])

  const startSos = () => {
    setCountdown(5)
    setDeadline(Date.now() + 5000)
    setSosState('countdown')
  }

  const resetSos = () => {
    setCountdown(5)
    setDeadline(null)
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
            <Route path="/profile" element={<FeaturePage title="Profile" description="Your profile, trusted contacts, and privacy controls will appear here after authentication is connected." icon={CircleUserRound} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
        {sosState === 'countdown' && <SosCountdown countdown={countdown} onCancel={resetSos} />}
        {sosState === 'demo-active' && <ActiveSosPanel onEnd={resetSos} />}
        {sosState === 'idle' && <BottomNavigation />}
        <span className="home-indicator" aria-hidden="true" />
      </div>
    </main>
  )
}
