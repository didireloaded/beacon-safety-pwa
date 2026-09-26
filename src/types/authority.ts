export type AuthorityContact = {
  id: string
  name: string
  town: string | null
  region: string | null
  category: string
  phone_primary: string
  phone_secondary: string | null
  available_24_7: boolean
  verified_at: string
  source_url: string
  latitude: number | null
  longitude: number | null
  notes: string | null
}
