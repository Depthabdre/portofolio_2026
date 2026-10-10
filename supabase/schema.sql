-- Journal Studio: run this once for a NEW Supabase project.
-- Existing projects: use migrations/202610210001_journal_studio.sql instead.
-- No sample content is inserted.
begin;

create table if not exists public.now_status (
  id uuid primary key default gen_random_uuid(),
  active_project text not null,
  description text not null,
  current_milestone text not null,
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  status_label text not null default 'Building' check (status_label in ('Building', 'Shipped', 'Exploring', 'Paused')),
  project_url text,
  updated_at timestamptz not null default now()
);

create table if not exists public.challenge_tracks (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null,
  duration text not null,
  cadence text not null,
  start_date date,
  end_date date,
  days_per_week integer check (days_per_week between 1 and 7),
  preferred_days integer[] not null default '{}',
  timezone text not null default 'Africa/Addis_Ababa',
  target_count integer not null check (target_count > 0),
  completed_count integer not null default 0,
  status text not null default 'active' check (status in ('planned', 'active', 'paused', 'completed', 'archived')),
  description text not null,
  created_at timestamptz not null default now(),
  constraint challenge_tracks_date_range check (end_date >= start_date)
);

create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  track_slug text references public.challenge_tracks(slug) on update cascade on delete set null,
  challenge_name text not null,
  category text not null,
  day_number integer not null,
  title text not null,
  summary text not null default '',
  learnings text not null default '',
  code_snippet text,
  tags text[] not null default '{}',
  completed_date date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text not null default '',
  content text not null default '',
  cover_image text,
  tags text[] not null default '{}',
  published boolean not null default false,
  published_at timestamptz,
  archived_at timestamptz,
  track_slug text references public.challenge_tracks(slug) on update cascade on delete set null,
  reading_time text,
  views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_challenges_track_date on public.challenges(track_slug, completed_date desc);
create index if not exists idx_posts_published_date on public.posts(published, published_at desc);
create index if not exists idx_posts_track on public.posts(track_slug);

-- Public reads; all writes go through authenticated server actions using the service key.
alter table public.now_status enable row level security;
alter table public.challenge_tracks enable row level security;
alter table public.challenges enable row level security;
alter table public.posts enable row level security;

drop policy if exists "Admin full access now_status" on public.now_status;
drop policy if exists "Admin full access challenge_tracks" on public.challenge_tracks;
drop policy if exists "Admin full access challenges" on public.challenges;
drop policy if exists "Admin full access posts" on public.posts;

drop policy if exists "Public can read now_status" on public.now_status;
create policy "Public can read now_status" on public.now_status for select to anon, authenticated using (true);
drop policy if exists "Public can read challenge_tracks" on public.challenge_tracks;
create policy "Public can read challenge_tracks" on public.challenge_tracks for select to anon, authenticated using (status <> 'archived');
drop policy if exists "Public can read challenges" on public.challenges;
create policy "Public can read challenges" on public.challenges for select to anon, authenticated
using (exists (select 1 from public.challenge_tracks t where t.slug = track_slug and t.status <> 'archived'));
drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts" on public.posts for select to anon, authenticated using (published = true and archived_at is null);

grant select on public.now_status, public.challenge_tracks, public.challenges, public.posts to anon, authenticated;
grant all on public.now_status, public.challenge_tracks, public.challenges, public.posts to service_role;

-- Refresh the API's table/column metadata after this transaction commits.
notify pgrst, 'reload schema';

commit;
