import { useEffect, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { CircleUserRound, LogOut, Mail } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export function ProfilePage() {
  const { configured, loading, user, profile, refreshProfile } = useAuth()
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [town, setTown] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [working, setWorking] = useState(false)

  useEffect(() => {
    setFullName(profile?.full_name ?? '')
    setTown(profile?.town ?? '')
  }, [profile])

  const sendSignInLink = async (event: FormEvent) => {
    event.preventDefault()
    if (!supabase) return
    setWorking(true)
    setStatus(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/profile` },
    })
    setStatus(error ? error.message : 'Check your email for your secure sign-in link.')
    setWorking(false)
  }

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault()
    if (!supabase || !user) return
    setWorking(true)
    setStatus(null)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim() || null, town: town.trim() || null, updated_at: new Date().toISOString() })
      .eq('id', user.id)
    if (error) setStatus('Your profile could not be saved. Please try again.')
    else {
      await refreshProfile()
      setStatus('Profile saved.')
    }
    setWorking(false)
  }

  if (!configured) return <ProfileShell><ProfileMessage title="Accounts not connected" body="Add the Supabase project URL and publishable key to enable secure sign-in." /></ProfileShell>
  if (loading) return <ProfileShell><ProfileMessage title="Checking your session" body="Loading your Beacon profile…" /></ProfileShell>

  if (!user) {
    return (
      <ProfileShell>
        <form className="profile-form" onSubmit={sendSignInLink}>
          <div className="profile-intro"><Mail size={24} /><h2>Sign in to Beacon</h2><p>We’ll email you a secure, one-time sign-in link. No password or phone number required.</p></div>
          <label><span>Email address</span><input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <button className="primary-action dark" disabled={working}>{working ? 'Sending link…' : 'Email me a sign-in link'}</button>
          {status && <p className="form-status" role="status">{status}</p>}
        </form>
      </ProfileShell>
    )
  }

  return (
    <ProfileShell>
      <form className="profile-form" onSubmit={saveProfile}>
        <div className="profile-intro"><CircleUserRound size={28} /><h2>Your profile</h2><p>{user.email}</p></div>
        <label><span>Full name</span><input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Add your name" /></label>
        <label><span>Town</span><input value={town} onChange={(event) => setTown(event.target.value)} placeholder="Add your town" /></label>
        <button className="primary-action dark" disabled={working}>{working ? 'Saving…' : 'Save profile'}</button>
        {status && <p className="form-status" role="status">{status}</p>}
      </form>
      <button className="sign-out-action" onClick={() => void supabase?.auth.signOut()}><LogOut size={17} />Sign out</button>
    </ProfileShell>
  )
}

function ProfileShell({ children }: { children: ReactNode }) {
  return <div className="screen profile-screen"><header className="feature-header"><strong className="wordmark">Beacon</strong></header>{children}</div>
}

function ProfileMessage({ title, body }: { title: string; body: string }) {
  return <div className="directory-message profile-message" role="status"><strong>{title}</strong><span>{body}</span></div>
}
