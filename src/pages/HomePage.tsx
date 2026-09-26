import { ArrowRight, Bell, CircleHelp, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar } from '../components/shared/Avatar'
import { useAuth } from '../contexts/AuthContext'
import { demoContacts } from '../data/demoContacts'

type HomePageProps = { onStartSos: () => void }

export function HomePage({ onStartSos }: HomePageProps) {
  const { user, profile } = useAuth()
  const displayName = profile?.full_name?.trim() || user?.email?.split('@')[0] || 'there'
  const initials = displayName === 'there'
    ? 'B'
    : displayName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toLocaleUpperCase()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const town = profile?.town?.trim() || 'Windhoek'

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
        <div><span>{greeting}</span><h2>Hi, {displayName}!</h2></div>
        <Avatar initials={initials} tone="#384558" small />
      </div>

      <div className="home-context" aria-label="Beacon status">
        <span><MapPin size={15} />Viewing {town}</span>
        <strong><i aria-hidden="true" />Limited protection · Services not connected</strong>
      </div>

      <section className="circle-section" aria-label="Demo trusted contacts">
        <div className="section-label"><span>Your circle</span><Link to="/profile">Manage</Link></div>
        <div className="contact-row">
          {demoContacts.map((contact) => (
            <div className="contact-person" key={contact.name}>
              <Avatar initials={contact.initials} tone={contact.tone} />
              <span>{contact.name}</span>
            </div>
          ))}
        </div>
        <p className="circle-note">Demo contacts only · No one will be notified</p>
      </section>

      <section className="sos-zone" aria-label="SOS demo control">
        <button className="sos-orb" onClick={onStartSos} aria-label="Open the active SOS preview">
          <span className="sos-waves">⌁</span><strong>SOS</strong><small>Tap</small>
        </button>
        <p>Tap once to open the SOS preview</p>
        <small className="sos-capabilities">Location · Audio · Alerts are not connected</small>
      </section>

      <section className="local-activity" aria-labelledby="activity-title">
        <Link className="nearby-status" to="/map"><span>No live nearby status</span><small>Incident service not connected</small><ArrowRight size={17} /></Link>
        <div className="activity-heading">
          <div><h2 id="activity-title">What’s happening</h2><span>{town}</span></div>
          <Link to="/community">See all</Link>
        </div>
        <div className="activity-empty">
          <strong>Community updates are not connected yet</strong>
          <p>Verified local safety posts will appear here once the community service is available.</p>
        </div>
        <Link className="community-link" to="/community">View community <ArrowRight size={16} /></Link>
      </section>
    </div>
  )
}
