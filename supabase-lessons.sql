-- ===================================================================
-- Lesson content — DewLab
--
-- Run in Supabase → SQL Editor AFTER supabase-schema.sql and
-- supabase-admin.sql. Safe to re-run.
--
-- Until now a lesson lived in lessons.js and only a developer could
-- change one. This table holds edits made in the admin panel, and the
-- site merges them over the built-in twelve at load.
--
-- WHY AN OVERRIDE RATHER THAN A REPLACEMENT
-- The twelve shipped lessons stay in the code as the floor. If this
-- table is empty, unreachable, or a row is deleted, the site still has
-- twelve working lessons. Nobody can edit DewLab into an empty state.
-- ===================================================================

create table if not exists public.lessons (
  slug        text primary key,
  world       text not null,
  n           smallint,
  data        jsonb not null,          -- the whole lesson record
  published   boolean not null default false,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users(id) on delete set null
);

alter table public.lessons enable row level security;

-- Anyone signed in reads published lessons. A draft is visible only to
-- an admin, so Ms. Nia can work on next term's lesson without it
-- appearing half-written on a family's dashboard.
drop policy if exists lessons_read on public.lessons;
create policy lessons_read on public.lessons
  for select using (published or public.is_admin());

-- Only an admin writes. Three separate policies rather than "for all",
-- so a mistake in one cannot quietly grant the others.
drop policy if exists lessons_insert on public.lessons;
create policy lessons_insert on public.lessons
  for insert with check (public.is_admin());

drop policy if exists lessons_update on public.lessons;
create policy lessons_update on public.lessons
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists lessons_delete on public.lessons;
create policy lessons_delete on public.lessons
  for delete using (public.is_admin());

-- Keep the timestamp honest without trusting the browser to send it.
create or replace function public.lessons_touch()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end $$;

drop trigger if exists lessons_touch on public.lessons;
create trigger lessons_touch before insert or update on public.lessons
  for each row execute function public.lessons_touch();

-- A record of what changed, so an edit that breaks a lesson can be
-- read back and undone. Append-only: no update or delete policy.
create table if not exists public.lesson_history (
  id          bigserial primary key,
  slug        text not null,
  data        jsonb not null,
  saved_at    timestamptz not null default now(),
  saved_by    uuid references auth.users(id) on delete set null
);

alter table public.lesson_history enable row level security;

drop policy if exists lesson_history_read on public.lesson_history;
create policy lesson_history_read on public.lesson_history
  for select using (public.is_admin());

drop policy if exists lesson_history_insert on public.lesson_history;
create policy lesson_history_insert on public.lesson_history
  for insert with check (public.is_admin());

create index if not exists lesson_history_slug_idx
  on public.lesson_history (slug, saved_at desc);
