import { useEffect, useMemo, useState } from 'react'
import { MapPin, Phone, Search, ShieldCheck } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { AuthorityContact } from '../types/authority'

const towns = [
  'Windhoek', 'Swakopmund', 'Walvis Bay', 'Oshakati', 'Ondangwa', 'Rundu',
  'Katima Mulilo', 'Otjiwarongo', 'Tsumeb', 'Grootfontein', 'Gobabis',
  'Keetmanshoop', 'Lüderitz', 'Mariental', 'Rehoboth',
]

export function AuthoritiesPage() {
  const [town, setTown] = useState('Windhoek')
  const [query, setQuery] = useState('')
  const [contacts, setContacts] = useState<AuthorityContact[]>([])
  const [loading, setLoading] = useState(Boolean(supabase))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) return
    let active = true
    setLoading(true)
    setError(null)

    supabase
      .from('authority_contacts')
      .select('id,name,town,region,category,phone_primary,phone_secondary,available_24_7,verified_at,source_url,latitude,longitude,notes')
      .or(`town.eq.${town},town.is.null`)
      .order('priority', { ascending: true })
      .order('name', { ascending: true })
      .then(({ data, error: requestError }) => {
        if (!active) return
        if (requestError) setError('The authority directory could not be loaded. Try again later.')
        else setContacts((data ?? []) as AuthorityContact[])
        setLoading(false)
      })

    return () => { active = false }
  }, [town])

  const visibleContacts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    if (!normalizedQuery) return contacts
    return contacts.filter((contact) =>
      [contact.name, contact.category, contact.phone_primary]
        .some((value) => value.toLocaleLowerCase().includes(normalizedQuery)),
    )
  }, [contacts, query])

  const local = visibleContacts.filter((contact) => contact.town === town)
  const nationwide = visibleContacts.filter((contact) => contact.town === null)

  return (
    <div className="screen authorities-screen">
      <header className="directory-header">
        <div><small>Authorities</small><h1>{town}</h1></div>
        <span className="directory-mark" aria-hidden="true"><ShieldCheck size={22} /></span>
      </header>

      <label className="town-select">
        <span>Current town</span>
        <select value={town} onChange={(event) => setTown(event.target.value)}>
          {towns.map((option) => <option key={option}>{option}</option>)}
        </select>
      </label>

      <label className="authority-search">
        <Search size={18} aria-hidden="true" />
        <span className="sr-only">Search authorities</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search authorities…" />
      </label>

      {!supabase && <DirectoryMessage title="Directory not connected" body="Add the Supabase project URL and publishable key to load verified contacts." />}
      {loading && <DirectoryMessage title="Loading directory" body="Checking verified contacts for this town…" />}
      {error && <DirectoryMessage title="Directory unavailable" body={error} />}
      {supabase && !loading && !error && visibleContacts.length === 0 && (
        <DirectoryMessage title="No verified contacts found" body="Try another town or search term. For an immediate emergency, use your locally verified emergency number." />
      )}

      {local.length > 0 && <ContactSection title={`${town} contacts`} contacts={local} />}
      {nationwide.length > 0 && <ContactSection title="Nationwide" contacts={nationwide} />}
    </div>
  )
}

function DirectoryMessage({ title, body }: { title: string; body: string }) {
  return <div className="directory-message" role="status"><strong>{title}</strong><span>{body}</span></div>
}

function ContactSection({ title, contacts }: { title: string; contacts: AuthorityContact[] }) {
  return (
    <section className="authority-section">
      <h2>{title}</h2>
      <div className="authority-list">
        {contacts.map((contact) => <ContactCard key={contact.id} contact={contact} />)}
      </div>
    </section>
  )
}

function ContactCard({ contact }: { contact: AuthorityContact }) {
  const directionsUrl = contact.latitude !== null && contact.longitude !== null
    ? `geo:${contact.latitude},${contact.longitude}?q=${contact.latitude},${contact.longitude}(${encodeURIComponent(contact.name)})`
    : null
  const verifiedDate = new Intl.DateTimeFormat('en-NA', { dateStyle: 'medium' }).format(new Date(contact.verified_at))

  return (
    <article className="authority-card">
      <div className="authority-card-copy">
        <small>{contact.category}</small>
        <h3>{contact.name}</h3>
        <a href={`tel:${contact.phone_primary.replace(/\s/g, '')}`}>{contact.phone_primary}</a>
        {contact.available_24_7 && <span>Available 24/7</span>}
        <a className="verification-link" href={contact.source_url} target="_blank" rel="noreferrer">Verified {verifiedDate} · View source</a>
      </div>
      <div className="authority-actions">
        <a className="call-action" href={`tel:${contact.phone_primary.replace(/\s/g, '')}`}><Phone size={17} />Call</a>
        {directionsUrl && <a href={directionsUrl} target="_blank" rel="noreferrer"><MapPin size={17} />Directions</a>}
      </div>
    </article>
  )
}
