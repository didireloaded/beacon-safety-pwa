import { useEffect, useState } from 'react'
import { BottomNavigation } from '../components/navigation/BottomNavigation'
import { ActiveSosPanel } from '../components/sos/ActiveSosPanel'
import { SosCountdown } from '../components/sos/SosCountdown'
import { HomePage } from '../pages/HomePage'
import type { SosState } from '../types/sos'

export default function App() {
  const [sosState, setSosState] = useState<SosState>('idle')
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (sosState !== 'countdown') return
    if (countdown === 0) {
      setSosState('sent')
      return
    }
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [countdown, sosState])

  const startSos = () => {
    setCountdown(5)
    setSosState('countdown')
  }

  const resetSos = () => {
    setCountdown(5)
    setSosState('idle')
  }

  return (
    <main className="app-shell" aria-label="Beacon safety app">
      <div className="app-frame">
        {sosState === 'idle' && <HomePage onStartSos={startSos} />}
        {sosState === 'countdown' && <SosCountdown countdown={countdown} onCancel={resetSos} />}
        {sosState === 'sent' && <ActiveSosPanel onEnd={resetSos} />}
        <BottomNavigation />
        <span className="home-indicator" aria-hidden="true" />
      </div>
    </main>
  )
}
