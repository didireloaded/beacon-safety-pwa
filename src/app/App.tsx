import { useEffect, useState } from 'react'
import { BottomNavigation } from '../components/navigation/BottomNavigation'
import { ActiveSosPanel } from '../components/sos/ActiveSosPanel'
import { SosCountdown } from '../components/sos/SosCountdown'
import { HomePage } from '../pages/HomePage'
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
        {sosState === 'idle' && <HomePage onStartSos={startSos} />}
        {sosState === 'countdown' && <SosCountdown countdown={countdown} onCancel={resetSos} />}
        {sosState === 'demo-active' && <ActiveSosPanel onEnd={resetSos} />}
        {sosState === 'idle' && <BottomNavigation />}
        <span className="home-indicator" aria-hidden="true" />
      </div>
    </main>
  )
}
