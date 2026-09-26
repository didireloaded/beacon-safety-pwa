import { CircleUserRound, Home, MessageCircle, Users } from 'lucide-react'

export function BottomNavigation() {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <button className="active"><Home size={18} /><span>Home</span></button>
      <button><Users size={18} /><span>Contacts</span></button>
      <button><MessageCircle size={18} /><span>Chat</span></button>
      <button><CircleUserRound size={18} /><span>Profile</span></button>
    </nav>
  )
}

