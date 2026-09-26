import type { CSSProperties } from 'react'
import { MapPin } from 'lucide-react'
import { demoContacts } from '../../data/demoContacts'
import { Avatar } from '../shared/Avatar'

type SosCountdownProps = { countdown: number; onCancel: () => void }

export function SosCountdown({ countdown, onCancel }: SosCountdownProps) {
  return (
    <div className="screen action-screen">
      <header className="action-header"><button onClick={onCancel}>Cancel</button><strong>SOS</strong><span /></header>
      <div className="action-copy"><small>SOS COUNTDOWN</small><h2>Stay calm.<br />We’re getting ready.</h2></div>
      <div className="countdown-orb" style={{ '--sweep': `${(5 - countdown) * 72}deg` } as CSSProperties}>
        <div className="countdown-core"><strong>{countdown}</strong><span>seconds</span></div>
        {demoContacts.slice(0, 3).map((contact, index) => (
          <span className={`orbit-avatar orbit-avatar-${index + 1}`} key={contact.name}>
            <Avatar initials={contact.initials} tone={contact.tone} small />
          </span>
        ))}
      </div>
      <div className="notice-card"><MapPin size={18} /><span>This demo does not access or share your location.</span></div>
      <button className="primary-action" onClick={onCancel}>I’m safe — cancel SOS</button>
    </div>
  )
}
