# Todayler Onboarding Standalone

Fully standalone Expo subproject for onboarding -> signup -> paywall.

## What this is
- Independent app runtime inside `onboarding-standalone/`
- Real Supabase + RevenueCat integrations
- Localhost runnable without using main app routes

## Entry route
- `/onboarding/role-picker`
- default `/` redirects there

## Setup
1. `cd onboarding-standalone`
2. `cp .env.example .env` and fill keys
3. `npm install`
4. `npm run web`

## Scripts
- `npm run start`
- `npm run web`
- `npm run typecheck`

## Included source
- `app/onboarding/*`
- `app/paywall.tsx`
- local minimal `app/(tabs)/index.tsx` completion screen
- vendored `contexts`, `lib`, `data`, `components`, `constants`

## Notes
- This is a one-time snapshot and does not auto-sync with the main app.
- Main app is untouched.
