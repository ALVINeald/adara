-- Adara -- Therapist Directory enhancements
-- Additive only. therapists and appointment_requests keep their
-- existing names/shape; nothing here breaks current queries.

alter table therapists
  add column if not exists specialties text[] not null default '{}',
  add column if not exists years_experience smallint,
  add column if not exists location text,
  add column if not exists languages text[] not null default '{}',
  add column if not exists session_types text[] not null default '{}', -- 'online' | 'in_person'
  add column if not exists accepting_new_clients boolean not null default true,
  -- Defaults to false on purpose -- this is a real flag, not a
  -- decorative badge. Only set true for profiles Adara has actually
  -- vetted; existing rows stay unverified until reviewed.
  add column if not exists is_verified boolean not null default false;

-- Existing single `specialty` column is left as-is for backward
-- compatibility with anything still reading it; `specialties` (plural)
-- is the new source of truth for the chip-based filter UI. Worth a
-- one-time backfill (specialties = array[specialty]) if you want the
-- old data to show chips immediately -- not run automatically here
-- since it's your data.

create table if not exists user_saved_therapists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  therapist_id uuid not null references therapists(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, therapist_id)
);

alter table user_saved_therapists enable row level security;

create policy "own saved therapists" on user_saved_therapists
  for all using (auth.uid() = user_id);

create index if not exists user_saved_therapists_user_idx
  on user_saved_therapists (user_id);

-- Appointment wizard adds structured fields alongside the existing
-- free-text `message` column, rather than replacing it.
alter table appointment_requests
  add column if not exists preferred_contact_method text, -- 'phone' | 'email' | 'either'
  add column if not exists preferred_session_type text,    -- 'online' | 'in_person' | 'no_preference'
  add column if not exists availability_notes text;
