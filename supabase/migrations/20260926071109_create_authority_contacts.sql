create table public.authority_contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  town text,
  region text,
  category text not null check (category in (
    'Police', 'Fire & Rescue', 'Ambulance / Medical Rescue', 'Hospital',
    'Traffic / Law Enforcement', 'Municipal Emergency', 'GBV / Child Protection',
    'Sea Rescue', 'Disaster Management', 'Utilities Emergency'
  )),
  phone_primary text not null,
  phone_secondary text,
  toll_free boolean not null default false,
  email text,
  address text,
  available_24_7 boolean not null default false,
  verified boolean not null default false,
  verified_at timestamptz,
  source_url text,
  latitude double precision check (latitude between -90 and 90),
  longitude double precision check (longitude between -180 and 180),
  notes text,
  priority integer not null default 100 check (priority >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint verified_contacts_have_evidence check (
    not verified or (verified_at is not null and source_url is not null)
  ),
  constraint coordinate_pair_is_complete check (
    (latitude is null and longitude is null) or
    (latitude is not null and longitude is not null)
  )
);

create index authority_contacts_directory_idx
  on public.authority_contacts (town, active, verified, priority);

alter table public.authority_contacts enable row level security;

revoke all on table public.authority_contacts from anon, authenticated;
grant select on table public.authority_contacts to anon, authenticated;
grant insert, update, delete on table public.authority_contacts to authenticated;

create policy "Public can read active verified authority contacts"
  on public.authority_contacts for select
  to anon, authenticated
  using (active and verified);

create policy "Admins can read all authority contacts"
  on public.authority_contacts for select
  to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can insert authority contacts"
  on public.authority_contacts for insert
  to authenticated
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can update authority contacts"
  on public.authority_contacts for update
  to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can delete authority contacts"
  on public.authority_contacts for delete
  to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

comment on table public.authority_contacts is
  'Verified town-specific and nationwide public safety directory entries.';
