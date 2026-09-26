import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Bell, CircleHelp, Navigation } from 'lucide-react'
import { Avatar } from '../components/shared/Avatar'
import { demoContacts } from '../data/demoContacts'

type HomePageProps = { onStartSos: () => void }

function HoldSosButton({ onComplete }: { onComplete: () => void }) {
  const timer = useRef<number | null>(null)
  const [holding, setHolding] = useState(false)

  const cancelHold = () => {
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = null
    setHolding(false)
  }

  const startHold = () => {
    if (timer.current !== null) return
    setHolding(true)
    timer.current = window.setTimeout(() => {
      timer.current = null
      setHolding(false)
      navigator.vibrate?.(40)
      onComplete()
    }, 900)
  }

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current)
  }, [])

  return (
    <button
      className={`sos-orb${holding ? ' is-holding' : ''}`}
      onPointerDown={startHold}
      onPointerUp={cancelHold}
      onPointerCancel={cancelHold}
      onPointerLeave={cancelHold}
      onKeyDown={(event) => {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault()
          startHold()
        }
      }}
      onKeyUp={(event) => {
        if (event.key === ' ' || event.key === 'Enter') cancelHold()
      }}
      aria-label="Press and hold to start the five-second SOS demo countdown"
    >
      <span className="sos-waves">⌁</span><strong>SOS</strong><small>Hold</small>
    </button>
  )
}

export function HomePage({ onStartSos }: HomePageProps) {
  return (
    <div className="screen home-screen">
      <header className="topbar">
        <strong className="wordmark">Beacon</strong>
        <div className="top-actions">
          <button aria-label="Notifications unavailable in this prototype" disabled><Bell size={17} /></button>
          <button aria-label="Help unavailable in this prototype" disabled><CircleHelp size={17} /></button>
        </div>
      </header>
      <div className="greeting-row">
        <div><span>Good evening</span><h2>Hi, Selma!</h2></div>
        <Avatar initials="SN" tone="#384558" small />
      </div>
      <section className="circle-section" aria-label="Demo trusted contacts">
        <div className="section-label"><span>Your circle</span><small>Demo contacts</small></div>
        <div className="contact-row">
          {demoContacts.map((contact) => (
            <div className="contact-person" key={contact.name}>
              <Avatar initials={contact.initials} tone={contact.tone} />
              <span>{contact.name}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="sos-zone" aria-label="SOS demo control">
        <HoldSosButton onComplete={onStartSos} />
        <div className="recipient-stack" aria-hidden="true">
          {demoContacts.slice(0, 3).map((contact) => (
            <Avatar key={contact.name} initials={contact.initials} tone={contact.tone} small />
          ))}
          <span className="recipient-count">+1</span>
        </div>
        <p>Press and hold to preview the SOS countdown</p>
      </section>
      <button className="journey-row" disabled aria-describedby="journey-status">
        <span className="journey-icon"><Navigation size={17} /></span>
        <span><strong>Safe journeys</strong><small id="journey-status">Not available in this prototype</small></span>
        <ArrowRight size={17} />
      </button>
    </div>
  )
}
