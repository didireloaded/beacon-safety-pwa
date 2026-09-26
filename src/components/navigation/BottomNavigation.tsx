import { CircleUserRound, Home, MapPinned, ShieldCheck, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const destinations = [
  { label: 'Home', path: '/', icon: Home, end: true },
  { label: 'Map', path: '/map', icon: MapPinned },
  { label: 'Community', path: '/community', icon: Users },
  { label: 'Authorities', path: '/authorities', icon: ShieldCheck },
  { label: 'Profile', path: '/profile', icon: CircleUserRound },
]

export function BottomNavigation() {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {destinations.map(({ label, path, icon: Icon, end }) => (
        <NavLink key={path} to={path} end={end} aria-label={label}>
          <Icon size={18} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
