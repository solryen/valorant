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
