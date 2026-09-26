import { ArrowRight, Bell, CircleHelp, Navigation } from 'lucide-react'
import { Avatar } from '../components/shared/Avatar'
import { demoContacts } from '../data/demoContacts'

type HomePageProps = { onStartSos: () => void }

export function HomePage({ onStartSos }: HomePageProps) {
  return (
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
          {demoContacts.map((contact) => (
            <div className="contact-person" key={contact.name}>
              <Avatar initials={contact.initials} tone={contact.tone} />
              <span>{contact.name}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="sos-zone" aria-label="SOS control">
        <button className="sos-orb" onClick={onStartSos} aria-label="Start five-second SOS countdown">
          <span className="sos-waves">⌁</span><strong>SOS</strong>
        </button>
        <div className="recipient-stack" aria-hidden="true">
          {demoContacts.slice(0, 3).map((contact) => (
            <Avatar key={contact.name} initials={contact.initials} tone={contact.tone} small />
          ))}
          <span className="recipient-count">+1</span>
        </div>
        <p>Your SOS will be prepared for 4 people</p>
      </section>
      <button className="launch-control" onClick={onStartSos}>
        <span className="launch-arrow"><ArrowRight size={20} /></span><span>Start SOS countdown</span>
      </button>
      <button className="journey-row">
        <span className="journey-icon"><Navigation size={17} /></span>
        <span><strong>Start a safe journey</strong><small>Set a destination and arrival time</small></span>
        <ArrowRight size={17} />
      </button>
    </div>
  )
}

