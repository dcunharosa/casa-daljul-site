-- Helpers
create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 1) Site content (hybrid CMS: key/value)
create table if not exists public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- 2) Site media (images/videos stored in Supabase Storage)
create table if not exists public.site_media (
  id uuid primary key default gen_random_uuid(),
  section text not null,         -- 'hero' | 'gallery' | 'property' | 'experiences' | 'location'
  title text,
  alt text not null,
  storage_path text not null,    -- e.g. "gallery/filename.jpg"
  sort_order int not null default 0,
  is_primary boolean not null default false,  -- used for hero
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_media_section_chk check (section in ('hero','gallery','property','experiences','location'))
);

create trigger trg_site_media_updated_at
before update on public.site_media
for each row execute function public.set_updated_at();

-- 3) Pricing seasons (manual per-season nightly + weekly min/max)
create table if not exists public.pricing_seasons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_date date not null,
  end_date date not null,
  currency text not null default 'USD',
  nightly_min numeric(12,2),
  nightly_max numeric(12,2),
  weekly_min numeric(12,2),
  weekly_max numeric(12,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pricing_seasons_date_chk check (start_date < end_date),
  constraint pricing_seasons_nightly_chk check (
    (nightly_min is null and nightly_max is null) or (nightly_min is not null and nightly_max is not null and nightly_min <= nightly_max)
  ),
  constraint pricing_seasons_weekly_chk check (
    (weekly_min is null and weekly_max is null) or (weekly_min is not null and weekly_max is not null and weekly_min <= weekly_max)
  )
);

create trigger trg_pricing_seasons_updated_at
before update on public.pricing_seasons
for each row execute function public.set_updated_at();

-- 4) Stay rules (seasonal minimum stay + allowed check-in/out days + optional exact nights)
create table if not exists public.stay_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_date date not null,
  end_date date not null,
  priority int not null default 0,             -- higher wins if overlapping
  min_nights int not null default 1,
  allowed_check_in_dow smallint[] null,        -- e.g. {6} for Saturday-only
  allowed_check_out_dow smallint[] null,       -- e.g. {6} for Saturday-only
  enforce_exact_nights boolean not null default false,
  exact_nights int null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint stay_rules_date_chk check (start_date < end_date),
  constraint stay_rules_min_nights_chk check (min_nights >= 1),
  constraint stay_rules_exact_chk check (
    (enforce_exact_nights = false and exact_nights is null)
    or
    (enforce_exact_nights = true and exact_nights is not null and exact_nights >= 1)
  )
);

create trigger trg_stay_rules_updated_at
before update on public.stay_rules
for each row execute function public.set_updated_at();

-- 5) Blocked dates (admin blocks unavailable ranges)
create table if not exists public.blocked_dates (
  id uuid primary key default gen_random_uuid(),
  start_date date not null,
  end_date date not null,
  reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blocked_dates_date_chk check (start_date < end_date)
);

create trigger trg_blocked_dates_updated_at
before update on public.blocked_dates
for each row execute function public.set_updated_at();

-- 6) Quote requests (inbox)
create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  status text not null default 'new',          -- 'new' | 'replied' | 'booked' | 'closed'
  source_page text,                           -- e.g. "availability", "home"

  check_in date not null,
  check_out date not null,
  guests int not null,
  full_name text not null,
  email text not null,
  phone text,
  prefers_whatsapp boolean not null default false,

  pets boolean not null default false,
  pets_details text,
  event boolean not null default false,
  event_details text,

  arrival_time text,
  special_requests text,

  estimate_currency text,
  estimate_min numeric(12,2),
  estimate_max numeric(12,2),
  estimate_breakdown jsonb,                   -- snapshot of how estimate was computed

  constraint quote_requests_status_chk check (status in ('new','replied','booked','closed')),
  constraint quote_requests_dates_chk check (check_in < check_out),
  constraint quote_requests_guests_chk check (guests >= 1)
);

create trigger trg_quote_requests_updated_at
before update on public.quote_requests
for each row execute function public.set_updated_at();

-- RLS
alter table public.site_content enable row level security;
alter table public.site_media enable row level security;
alter table public.pricing_seasons enable row level security;
alter table public.stay_rules enable row level security;
alter table public.blocked_dates enable row level security;
alter table public.quote_requests enable row level security;

-- Public read policies (anon + authenticated)
create policy "public_read_site_content"
on public.site_content for select
to anon, authenticated
using (true);

create policy "public_read_site_media"
on public.site_media for select
to anon, authenticated
using (true);

create policy "public_read_pricing_seasons"
on public.pricing_seasons for select
to anon, authenticated
using (true);

create policy "public_read_stay_rules"
on public.stay_rules for select
to anon, authenticated
using (true);

-- Admin-only (authenticated) for blocked dates + quote inbox
create policy "admin_read_blocked_dates"
on public.blocked_dates for select
to authenticated
using (true);

create policy "admin_write_blocked_dates"
on public.blocked_dates for insert
to authenticated
with check (true);

create policy "admin_update_blocked_dates"
on public.blocked_dates for update
to authenticated
using (true)
with check (true);

create policy "admin_delete_blocked_dates"
on public.blocked_dates for delete
to authenticated
using (true);

create policy "admin_read_quote_requests"
on public.quote_requests for select
to authenticated
using (true);

create policy "admin_insert_quote_requests"
on public.quote_requests for insert
to authenticated
with check (true);

create policy "admin_update_quote_requests"
on public.quote_requests for update
to authenticated
using (true)
with check (true);

create policy "admin_delete_quote_requests"
on public.quote_requests for delete
to authenticated
using (true);

-- Admin write for public tables
create policy "admin_insert_site_content"
on public.site_content for insert
to authenticated
with check (true);

create policy "admin_update_site_content"
on public.site_content for update
to authenticated
using (true)
with check (true);

create policy "admin_delete_site_content"
on public.site_content for delete
to authenticated
using (true);

create policy "admin_insert_site_media"
on public.site_media for insert
to authenticated
with check (true);

create policy "admin_update_site_media"
on public.site_media for update
to authenticated
using (true)
with check (true);

create policy "admin_delete_site_media"
on public.site_media for delete
to authenticated
using (true);

create policy "admin_insert_pricing_seasons"
on public.pricing_seasons for insert
to authenticated
with check (true);

create policy "admin_update_pricing_seasons"
on public.pricing_seasons for update
to authenticated
using (true)
with check (true);

create policy "admin_delete_pricing_seasons"
on public.pricing_seasons for delete
to authenticated
using (true);

create policy "admin_insert_stay_rules"
on public.stay_rules for insert
to authenticated
with check (true);

create policy "admin_update_stay_rules"
on public.stay_rules for update
to authenticated
using (true)
with check (true);

create policy "admin_delete_stay_rules"
on public.stay_rules for delete
to authenticated
using (true);
