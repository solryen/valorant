<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/528ad4ee-ecb4-4c53-bee9-afb663e35c93

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key, or keep `GEMINI_API` as a fallback alias
3. Set `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, and `ARTICLE_ADMIN_EMAIL` in [.env.local](.env.local); the app also accepts the legacy `VITE_*` aliases if you prefer them
4. Set `VITE_BASE_PATH="/"` for a standalone Vercel deploy of this folder, or `VITE_BASE_PATH="/explore/"` if the app is being mounted inside the larger Todayler site
5. Run the app:
   `npm run dev`

## Auth flow

- `/signup` now supports Supabase email/password sign in, sign up, and password reset.
- Entering `8loop` unlocks the admin UI, but only `todaylerapp@gmail.com` can actually create, draft, publish, or delete articles.
- Set `ARTICLE_ADMIN_EMAIL=todaylerapp@gmail.com` locally so the app and edge function agree on the one allowed editor account; `VITE_SUPABASE_ADMIN_EMAIL` and `EXPO_PUBLIC_SUPABASE_ADMIN_EMAIL` also work as aliases.
- If password recovery is enabled in Supabase, the recovery link returns to `/signup?mode=recover` and lets the user set a new password.

## Newsletter storage

- The `/explore` newsletter form writes subscriber rows into a `newsletter_subscribers` table in Supabase.
- It also starts a Supabase email magic-link flow so the email can become a real auth account after verification.
- Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` inside this folder, or use the matching `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` aliases; the app does not read the repo-root env file.
- If Supabase env vars are missing, the form shows an error instead of crashing the page.

## Article sync

- The `/explore` article list reads published rows from `public.explore_articles` first, then falls back to the bundled seed articles.
- The 8loop admin flow writes article changes through the same-origin `/api/article-sync` proxy in this project.
- In Vercel, set `SUPABASE_URL` and `SUPABASE_ANON_KEY` for the serverless proxy so it can forward requests to the Supabase Edge Function.
- Realtime updates keep open `/explore` tabs in sync when new articles are added.

## Weekly article generation

- The admin dashboard now exposes an AI queue generation button that creates 6 scheduled articles through `/api/trigger-article-generation`.
- Local dev and Vercel both use the same server-side generator so weekly queued articles persist in Supabase.
- Required server env vars for generation:
  - `GEMINI_API_KEY` (or `GEMINI_API`)
  - `PEXELS_API_KEY`
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `ARTICLE_ADMIN_EMAIL` or `VITE_SUPABASE_ADMIN_EMAIL`
- Vercel has UTC cron pairs for weekly generation and daily publishing; the app itself only acts at 19:00 Europe/Athens so the local-time behavior stays correct across DST.
