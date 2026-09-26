# Beacon Safety

Beacon is a privacy-first, installable community-safety PWA for Windhoek, Namibia.

The current repository contains an early interactive interface prototype with:

- A trusted-circle home screen
- A five-second SOS demonstration flow
- Responsive PWA presentation
- An install manifest and offline service worker
- No analytics or telemetry

> The SOS workflow is a prototype. It does not contact emergency services.

## Local development

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
```

## Supabase directory setup

The Authorities route reads active, verified contacts from Supabase. It does not
ship emergency phone numbers in the frontend bundle.

1. Copy `.env.example` to `.env.local` and add the project URL and publishable
   key. Never place a secret or service-role key in a `VITE_` variable.
2. Apply the migration in `supabase/migrations` to the target project.
3. Add authority records through an authenticated admin workflow. A record
   cannot be marked verified without both `verified_at` and `source_url`.

The current screen uses manual town selection. Automatic GPS and reverse
geocoding are intentionally not enabled yet.

## Privacy

The current prototype does not include analytics, crash reporting, or remote
fonts. When Supabase environment variables are configured, the Authorities
screen sends the selected town and directory query to that Supabase instance.
It does not request device location.
