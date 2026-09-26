import { useEffect, useState } from 'react'
import { ArrowRight, Bell, CircleHelp, CircleUserRound, Home, MapPin, MessageCircle, Navigation, PhoneCall, Users } from 'lucide-react'

type SosState = 'idle' | 'countdown' | 'sent'

const contacts = [
  { initials: 'LM', name: 'Lydia', tone: '#f6b49d' },
  { initials: 'TK', name: 'Tate', tone: '#83c7cc' },
  { initials: 'AN', name: 'Anna', tone: '#f4cd7b' },
  { initials: 'JM', name: 'Jonah', tone: '#f08367' },
]

function Avatar({ initials, tone, small = false }: { initials: string; tone: string; small?: boolean }) {
  return <span className={small ? 'avatar avatar-small' : 'avatar'} style={{ '--avatar-tone': tone } as React.CSSProperties}>{initials}</span>
}

function App() {
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

          {sosState === 'idle' && (
            <div className="screen home-screen">
              <header className="topbar">
                <strong className="wordmark">Beacon</strong>
                <div className="top-actions">
                  <button aria-label="Notifications"><Bell size={17} /></button>
                  <button aria-label="Help"><CircleHelp size={17} /></button>
                </div>
              </header>

              <div className="greeting-row">
                <div><span>Good evening</span><h2>Hi, Selma!</h2></div>
                <Avatar initials="SN" tone="#384558" small />
              </div>

              <section className="circle-section" aria-label="Demo trusted contacts">
                <div className="section-label"><span>Your circle</span><small>Demo contacts</small></div>
                <div className="contact-row">
                  {contacts.map((contact) => (
                    <div className="contact-person" key={contact.name}>
                      <Avatar initials={contact.initials} tone={contact.tone} />
                      <span>{contact.name}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="sos-zone" aria-label="SOS control">
                <button className="sos-orb" onClick={startSos} aria-label="Start five-second SOS countdown">
                  <span className="sos-waves">⌁</span><strong>SOS</strong>
                </button>
                <div className="recipient-stack" aria-hidden="true">
                  {contacts.slice(0, 3).map((contact) => <Avatar key={contact.name} initials={contact.initials} tone={contact.tone} small />)}
                  <span className="recipient-count">+1</span>
                </div>
                <p>Your SOS will be prepared for 4 people</p>
              </section>

              <button className="launch-control" onClick={startSos}>
                <span className="launch-arrow"><ArrowRight size={20} /></span><span>Start SOS countdown</span>
              </button>

              <button className="journey-row">
                <span className="journey-icon"><Navigation size={17} /></span>
                <span><strong>Start a safe journey</strong><small>Set a destination and arrival time</small></span>
                <ArrowRight size={17} />
              </button>
            </div>
          )}

          {sosState === 'countdown' && (
            <div className="screen action-screen">
              <header className="action-header"><button onClick={resetSos}>Cancel</button><strong>SOS</strong><span /></header>
              <div className="action-copy"><small>SOS COUNTDOWN</small><h2>Stay calm.<br />We’re getting ready.</h2></div>
              <div className="countdown-orb" style={{ '--sweep': `${(5 - countdown) * 72}deg` } as React.CSSProperties}>
                <div className="countdown-core"><strong>{countdown}</strong><span>seconds</span></div>
                {contacts.slice(0, 3).map((contact, index) => (
                  <span className={`orbit-avatar orbit-avatar-${index + 1}`} key={contact.name}><Avatar initials={contact.initials} tone={contact.tone} small /></span>
                ))}
              </div>
              <div className="notice-card"><MapPin size={18} /><span>Your latest location will be included when the countdown ends.</span></div>
              <button className="primary-action" onClick={resetSos}>I’m safe — cancel SOS</button>
            </div>
          )}

          {sosState === 'sent' && (
            <div className="screen action-screen sent-screen">
              <header className="action-header"><span /><strong>ACTIVE SOS</strong><span className="active-dot" /></header>
              <div className="sent-icon"><PhoneCall size={30} /></div>
              <div className="action-copy"><small>DEMO ALERT SHARED</small><h2>Your circle has<br />your location.</h2><p>This prototype does not contact emergency services.</p></div>
              <div className="delivery-list" aria-label="Demo delivery status">
                {contacts.slice(0, 3).map((contact, index) => (
                  <div key={contact.name}>
                    <Avatar initials={contact.initials} tone={contact.tone} small />
                    <span><strong>{contact.name}</strong><small>{index === 0 ? 'Demo alert viewed' : 'Demo notification sent'}</small></span>
                    <em>{index === 0 ? 'Viewed' : 'Sent'}</em>
                  </div>
                ))}
              </div>
              <button className="primary-action dark" onClick={resetSos}>End demo alert</button>
            </div>
          )}

          <nav className="bottom-nav" aria-label="Main navigation">
            <button className="active"><Home size={18} /><span>Home</span></button>
            <button><Users size={18} /><span>Contacts</span></button>
            <button><MessageCircle size={18} /><span>Chat</span></button>
            <button><CircleUserRound size={18} /><span>Profile</span></button>
          </nav>
          <span className="home-indicator" aria-hidden="true" />
      </div>
    </main>
  )
}

export default App
