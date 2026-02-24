-- Worldwide news ingestion schema
-- - Sources (RSS/Atom feeds)
-- - Articles (deduped via url_hash)
-- - Bookmarks + basic user preferences

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.news_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  site_url text,
  feed_url text not null unique,
  category text,
  country text,
  language text,
  is_active boolean not null default true,
  poll_interval_minutes integer not null default 10 check (poll_interval_minutes between 1 and 1440),
  last_fetched_at timestamptz,
  etag text,
  last_modified text,
  error_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'set_news_sources_updated_at'
  ) then
    create trigger set_news_sources_updated_at
    before update on public.news_sources
    for each row execute function public.set_updated_at();
  end if;
end$$;

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.news_sources(id) on delete cascade,
  title text not null,
  summary text,
  image_url text,
  canonical_url text not null,
  url_hash text not null,
  author text,
  published_at timestamptz,
  category text,
  country text,
  language text,
  raw jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (url_hash)
);

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'set_articles_updated_at'
  ) then
    create trigger set_articles_updated_at
    before update on public.articles
    for each row execute function public.set_updated_at();
  end if;
end$$;

create index if not exists articles_published_at_idx
  on public.articles (published_at desc nulls last);

create index if not exists articles_source_published_idx
  on public.articles (source_id, published_at desc nulls last);

create index if not exists articles_category_published_idx
  on public.articles (category, published_at desc nulls last);

create table if not exists public.bookmarks (
  user_id uuid not null references auth.users(id) on delete cascade,
  article_id uuid not null references public.articles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, article_id)
);

create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  categories text[] not null default '{}',
  countries text[] not null default '{}',
  languages text[] not null default '{}',
  source_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'set_user_preferences_updated_at'
  ) then
    create trigger set_user_preferences_updated_at
    before update on public.user_preferences
    for each row execute function public.set_updated_at();
  end if;
end$$;

alter table public.news_sources enable row level security;
alter table public.articles enable row level security;
alter table public.bookmarks enable row level security;
alter table public.user_preferences enable row level security;

do $$
begin
  -- Public read-only access for sources + articles (MVP feed)
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'news_sources'
      and policyname = 'Public read sources'
  ) then
    create policy "Public read sources"
      on public.news_sources
      for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'articles'
      and policyname = 'Public read articles'
  ) then
    create policy "Public read articles"
      on public.articles
      for select
      using (true);
  end if;

  -- Bookmarks: user-owned rows only
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'bookmarks'
      and policyname = 'User read own bookmarks'
  ) then
    create policy "User read own bookmarks"
      on public.bookmarks
      for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'bookmarks'
      and policyname = 'User insert own bookmarks'
  ) then
    create policy "User insert own bookmarks"
      on public.bookmarks
      for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'bookmarks'
      and policyname = 'User delete own bookmarks'
  ) then
    create policy "User delete own bookmarks"
      on public.bookmarks
      for delete
      using (auth.uid() = user_id);
  end if;

  -- Preferences: user-owned row only
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_preferences'
      and policyname = 'User read own preferences'
  ) then
    create policy "User read own preferences"
      on public.user_preferences
      for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_preferences'
      and policyname = 'User insert own preferences'
  ) then
    create policy "User insert own preferences"
      on public.user_preferences
      for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_preferences'
      and policyname = 'User update own preferences'
  ) then
    create policy "User update own preferences"
      on public.user_preferences
      for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end$$;

