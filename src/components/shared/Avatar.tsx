import type { CSSProperties } from 'react'

type AvatarProps = { initials: string; tone: string; small?: boolean }

export function Avatar({ initials, tone, small = false }: AvatarProps) {
  return (
    <span className={small ? 'avatar avatar-small' : 'avatar'} style={{ '--avatar-tone': tone } as CSSProperties}>
      {initials}
    </span>
  )
}

