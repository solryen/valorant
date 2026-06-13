# Supabase setup for `/explore`

## 1) Create the table

Run this SQL in the Supabase SQL editor:

```sql
create extension if not exists pgcrypto;

create table if not exists public.explore_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  language text not null check (language in ('el', 'en')),
  title text not null,
  subtitle text,
  body_markdown text not null,
  category text not null,
  baby_age_min integer not null default 0,
  baby_age_max integer not null default 24,
  tags text[] not null default '{}'::text[],
  featured_image_url text,
  author_name text not null,
  author_id text,
  expert_reviewed boolean not null default false,
  published_at timestamptz not null default now(),
  status text not null default 'published' check (status in ('published', 'draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists explore_articles_status_published_at_idx
  on public.explore_articles (status, published_at desc);

create index if not exists explore_articles_language_status_idx
  on public.explore_articles (language, status);

create index if not exists explore_articles_slug_idx
  on public.explore_articles (slug);

create or replace function public.set_explore_articles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_explore_articles_updated_at on public.explore_articles;
create trigger set_explore_articles_updated_at
before update on public.explore_articles
for each row execute function public.set_explore_articles_updated_at();

alter table public.explore_articles enable row level security;

drop policy if exists "Public can read published explore articles" on public.explore_articles;
create policy "Public can read published explore articles"
on public.explore_articles
for select
to anon, authenticated
using (status = 'published');

grant select on public.explore_articles to anon, authenticated;

alter publication supabase_realtime add table public.explore_articles;
```

## 2) Add the admin user

- Create or invite one Supabase Auth user for `todaylerapp@gmail.com`.
- Keep `ARTICLE_ADMIN_EMAIL=todaylerapp@gmail.com` locally so the UI and the Edge Function agree on which account may edit articles; `VITE_SUPABASE_ADMIN_EMAIL` and `EXPO_PUBLIC_SUPABASE_ADMIN_EMAIL` also work as aliases.

## 3) Set Edge Function secrets

For the `article-sync` Edge Function, set these secrets in Supabase:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ARTICLE_ADMIN_EMAIL`

The Edge Function uses the signed-in user’s access token to verify the editor account, then writes to `public.explore_articles` with the service role key.

## 4) Configure the Vercel proxy

For the standalone `/explore` deployment, set these server-side env vars in Vercel so `/api/article-sync` can forward requests:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

The browser can use either the `EXPO_PUBLIC_` vars or the legacy `VITE_` aliases in [.env.local](.env.local); article writes go through the same-origin API proxy first, which then forwards to the Supabase Edge Function.

## 5) Configure weekly article generation

To generate weekly queued articles through `/api/trigger-article-generation`, set these server-side env vars in Vercel:

- `GEMINI_API_KEY` (or `GEMINI_API`)
- `PEXELS_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ARTICLE_ADMIN_EMAIL` or `VITE_SUPABASE_ADMIN_EMAIL` or `EXPO_PUBLIC_SUPABASE_ADMIN_EMAIL`

The route verifies the admin session for manual runs and also accepts the weekly cron trigger defined in `vercel.json`.

## 6) Configure daily publishing

To publish one queued article per day at 19:00 Europe/Athens, set the same server-side env vars in Vercel and allow the daily cron pairs configured in `vercel.json` to call `/api/publish-queued-articles?source=cron`.

Vercel cron runs in UTC, so this project uses 16:00 and 17:00 UTC triggers and only acts when the app detects that the current Athens local time is exactly 19:00.

The publish route looks for the next due AI-generated draft in `public.explore_articles`, flips it to `published`, and leaves the remaining queued articles hidden until their own scheduled day.

## 7) Configure newsletter signup

Create a `public.newsletter_subscribers` table for the banner and inline signup forms:

```sql
create extension if not exists pgcrypto;

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  baby_age_label text,
  baby_age_min integer,
  baby_age_max integer,
  language text not null,
  source text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists newsletter_subscribers_email_idx
  on public.newsletter_subscribers (email);

create or replace function public.set_newsletter_subscribers_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_newsletter_subscribers_updated_at on public.newsletter_subscribers;
create trigger set_newsletter_subscribers_updated_at
before update on public.newsletter_subscribers
for each row execute function public.set_newsletter_subscribers_updated_at();

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Public can insert newsletter subscribers" on public.newsletter_subscribers;
create policy "Public can insert newsletter subscribers"
on public.newsletter_subscribers
for insert
to anon, authenticated
with check (true);
```

The newsletter form inserts the row first, then sends the Supabase magic-link email as the confirmation step. Duplicate emails are treated as a successful signup in the client.
