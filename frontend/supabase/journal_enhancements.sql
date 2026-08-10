-- Adara -- Journal enhancements
-- Run in the Supabase SQL editor. Additive only: extends the
-- existing journal_entries table, no existing columns touched.
-- Existing RLS policies scoped to `user_id = auth.uid()` already
-- cover these new columns (RLS is row-level, not column-level) --
-- no new policies needed for the table itself.

alter table journal_entries
  add column if not exists energy_level smallint check (energy_level between 1 and 5),
  add column if not exists stress_level smallint check (stress_level between 1 and 5),
  add column if not exists tags text[] not null default '{}',
  add column if not exists is_private boolean not null default true,
  add column if not exists is_favorited boolean not null default false,
  add column if not exists word_count integer not null default 0,
  add column if not exists deleted_at timestamptz;

-- Speeds up the main "my entries, newest first, excluding trashed"
-- query that the list panel runs on every load.
create index if not exists journal_entries_user_created_idx
  on journal_entries (user_id, created_at desc)
  where deleted_at is null;

-- Optional: permanently purge soft-deleted entries past the 30-day
-- recovery window. Not scheduled automatically -- wire this into a
-- Supabase cron job / Edge Function if/when you want it enforced,
-- rather than running it blind.
-- delete from journal_entries
--   where deleted_at is not null
--   and deleted_at < now() - interval '30 days';
