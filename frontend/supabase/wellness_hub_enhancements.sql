-- Adara -- Wellness Hub enhancements
-- Run in the Supabase SQL editor. Only 2 new tables -- wellness_sessions
-- (already exists) is untouched. Playlists and articles stay
-- code-defined content (components/wellness/playlists.ts,
-- articles.ts), same as before this change; no CMS-style tables were
-- added for them since there's no real dynamic content management
-- need yet.

create table if not exists user_saved_wellness_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('breathing', 'meditation', 'playlist', 'article')),
  item_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, item_type, item_id)
);

alter table user_saved_wellness_items enable row level security;

create policy "own saved wellness items" on user_saved_wellness_items
  for all using (auth.uid() = user_id);

create index if not exists user_saved_wellness_items_user_idx
  on user_saved_wellness_items (user_id);

create table if not exists user_wellness_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  breathing_pattern_id text,
  breathing_cycles smallint,
  breathing_custom_phases jsonb,
  updated_at timestamptz not null default now()
);

alter table user_wellness_preferences enable row level security;

create policy "own wellness preferences" on user_wellness_preferences
  for all using (auth.uid() = user_id);
