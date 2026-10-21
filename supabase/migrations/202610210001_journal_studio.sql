-- Upgrade the original journal schema. Existing content and URLs are preserved.
begin;

alter table public.challenge_tracks
  add column if not exists start_date date,
  add column if not exists end_date date,
  add column if not exists days_per_week integer check (days_per_week between 1 and 7),
  add column if not exists preferred_days integer[] not null default '{}',
  add column if not exists timezone text not null default 'Africa/Addis_Ababa';

alter table public.challenge_tracks drop constraint if exists challenge_tracks_status_check;
alter table public.challenge_tracks add constraint challenge_tracks_status_check
  check (status in ('planned', 'active', 'paused', 'completed', 'archived'));
alter table public.challenge_tracks drop constraint if exists challenge_tracks_date_range;
alter table public.challenge_tracks add constraint challenge_tracks_date_range check (end_date >= start_date);

-- Preserve existing dates rather than inventing schedules for older challenges.
update public.challenge_tracks set days_per_week =
  case when lower(cadence) = 'daily' then 7
       when cadence ~ '^[1-7]' then substring(cadence from 1 for 1)::integer
       else 1 end
where days_per_week is null;

alter table public.posts
  add column if not exists published_at timestamptz,
  add column if not exists archived_at timestamptz,
  add column if not exists track_slug text references public.challenge_tracks(slug) on update cascade on delete set null;
alter table public.posts alter column published set default false;
alter table public.posts alter column reading_time drop default;
-- The original schema only recorded creation dates; retain those for legacy articles.
update public.posts set published_at = created_at where published = true and published_at is null;

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

notify pgrst, 'reload schema';

commit;
