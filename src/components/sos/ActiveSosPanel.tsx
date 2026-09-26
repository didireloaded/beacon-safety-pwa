import { PhoneCall } from 'lucide-react'
import { demoContacts } from '../../data/demoContacts'
import { Avatar } from '../shared/Avatar'

type ActiveSosPanelProps = { onEnd: () => void }

export function ActiveSosPanel({ onEnd }: ActiveSosPanelProps) {
  return (
    <div className="screen action-screen sent-screen">
      <header className="action-header"><span /><strong>DEMO SOS</strong><span className="active-dot" /></header>
      <div className="sent-icon"><PhoneCall size={30} /></div>
      <div className="action-copy">
        <small>PREVIEW ONLY</small>
        <h2>This is how an active<br />SOS could appear.</h2>
        <p>No alert, notification, or location was shared.</p>
      </div>
      <div className="delivery-list" aria-label="Illustrative contact list; no alerts were sent">
        {demoContacts.slice(0, 3).map((contact) => (
          <div key={contact.name}>
            <Avatar initials={contact.initials} tone={contact.tone} small />
            <span><strong>{contact.name}</strong><small>Would receive an alert when connected</small></span>
            <em>Demo</em>
          </div>
        ))}
      </div>
      <button className="primary-action dark" onClick={onEnd}>End SOS preview</button>
    </div>
  )
}
