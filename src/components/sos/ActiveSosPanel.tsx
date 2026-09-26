import { PhoneCall } from 'lucide-react'
import { demoContacts } from '../../data/demoContacts'
import { Avatar } from '../shared/Avatar'

type ActiveSosPanelProps = { onEnd: () => void }

export function ActiveSosPanel({ onEnd }: ActiveSosPanelProps) {
  return (
    <div className="screen action-screen sent-screen">
      <header className="action-header"><span /><strong>ACTIVE SOS</strong><span className="active-dot" /></header>
      <div className="sent-icon"><PhoneCall size={30} /></div>
      <div className="action-copy">
        <small>DEMO ALERT SHARED</small>
        <h2>Your circle has<br />your location.</h2>
        <p>This prototype does not contact emergency services.</p>
      </div>
      <div className="delivery-list" aria-label="Demo delivery status">
        {demoContacts.slice(0, 3).map((contact, index) => (
          <div key={contact.name}>
            <Avatar initials={contact.initials} tone={contact.tone} small />
            <span><strong>{contact.name}</strong><small>{index === 0 ? 'Demo alert viewed' : 'Demo notification sent'}</small></span>
            <em>{index === 0 ? 'Viewed' : 'Sent'}</em>
          </div>
        ))}
      </div>
      <button className="primary-action dark" onClick={onEnd}>End demo alert</button>
    </div>
  )
}

