-- ===================================================================
-- Admin access — The Talking Garden
--
-- Run this in Supabase → SQL Editor AFTER supabase-schema.sql.
-- Safe to re-run.
--
-- Families can only ever see their own rows. Ms. Nia needs to see
-- across all of them to run sessions and report to funders, so she
-- gets an explicit admin role rather than a loosened policy.
-- ===================================================================

-- ---------- who is an admin -----------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  added_at   timestamptz not null default now()
);

alter table public.admins enable row level security;

-- An admin may see the admin list. Nobody else can, and nobody can
-- add themselves — rows are inserted from the Supabase dashboard.
drop policy if exists admins_read on public.admins;
create policy admins_read on public.admins
  for select using (
    exists (select 1 from public.admins a where a.user_id = auth.uid())
  );

-- ---------- pre-authorised by email --------------------------------
-- An admin can be named BEFORE they have an account. Put the address
-- in here and the moment that person signs up they are an admin —
-- no user id to look up, no second step after they register.
create table if not exists public.admin_emails (
  email     text primary key,
  note      text,
  added_at  timestamptz not null default now()
);

alter table public.admin_emails enable row level security;

-- Admin if the account is listed by id OR the signed-in email is on
-- the allowlist. Compared lower-case so capitals never lock anyone out.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select
    exists (select 1 from public.admins a where a.user_id = auth.uid())
    or exists (
      select 1 from public.admin_emails e
      where lower(e.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    );
$$;

drop policy if exists admin_emails_read on public.admin_emails;
create policy admin_emails_read on public.admin_emails
  for select using (public.is_admin());


-- ---------- admins may read across families -------------------------
-- Each of these ADDS a read path. The existing "own rows" policies are
-- untouched, so a parent's access does not change.

drop policy if exists children_admin_read on public.children;
create policy children_admin_read on public.children
  for select using (public.is_admin());

drop policy if exists attendance_admin_read on public.attendance;
create policy attendance_admin_read on public.attendance
  for select using (public.is_admin());

drop policy if exists quiz_admin_read on public.quiz_results;
create policy quiz_admin_read on public.quiz_results
  for select using (public.is_admin());

drop policy if exists progress_admin_read on public.progress;
create policy progress_admin_read on public.progress
  for select using (public.is_admin());

-- ---------- admins may run the sessions -----------------------------
drop policy if exists sessions_admin_write on public.sessions;
create policy sessions_admin_write on public.sessions
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists topics_admin_write on public.topics;
create policy topics_admin_write on public.topics
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- recurring sessions --------------------------------------
-- So a weekly garden session does not have to be re-entered every week.
alter table public.sessions add column if not exists repeat_weekly boolean not null default false;
alter table public.sessions add column if not exists host_name text;

-- ---------- the funder report ---------------------------------------
-- One row per child per topic: names, both dates, both scores, gain.
-- This is the thing that gets exported and attached to a grant report.
create or replace view public.child_progress as
select
  c.id                as child_id,
  c.name              as child_name,
  c.grade             as grade,
  t.slug              as topic_slug,
  t.name              as topic,
  pre.score           as before_score,
  pre.out_of          as before_out_of,
  pre.taken_at        as before_date,
  post.score          as after_score,
  post.out_of         as after_out_of,
  post.taken_at       as after_date,
  (post.score - pre.score) as skills_gained,
  att.created_at      as attended_at
from public.children c
cross join public.topics t
left join public.quiz_results pre
       on pre.child_id = c.id and pre.topic_slug = t.slug and pre.phase = 'pre'
left join public.quiz_results post
       on post.child_id = c.id and post.topic_slug = t.slug and post.phase = 'post'
left join public.attendance att
       on att.parent_id = c.parent_id and att.topic_slug = t.slug
where pre.id is not null or post.id is not null or att.id is not null;

-- A view does NOT inherit row level security from the tables beneath
-- it. Without this line child_progress runs with its creator's rights
-- and hands every child's name, grade and scores to anyone who asks,
-- signed in or not. security_invoker makes it obey the permissions of
-- whoever is querying, so only an admin sees across families.
alter view public.child_progress set (security_invoker = on);

-- ===================================================================
-- Name your admins here.
--
-- Replace the two addresses below with the real ones and run it. They
-- can then create an account in the normal way and will land straight
-- in the admin panel — nothing else to do afterwards.
--
-- Keep real addresses in this database, not in the code repository.
-- ===================================================================
-- insert into public.admin_emails (email, note) values
--   ('nia@example.org',   'Ms. Nia — Garden Director'),
--   ('kiara@example.org', 'Kiara — Programme Lead')
-- on conflict (email) do nothing;

-- ===================================================================
-- Sessions are a history, not a setting
-- ===================================================================
-- Each session a topic runs is its own row, so old garden words keep
-- unlocking and old recordings are never overwritten.
alter table public.sessions add column if not exists movie_url text;

-- Families need to read the schedule and the recordings; only admins
-- write. (The read policy from supabase-schema.sql already allows any
-- signed-in family to select.)

-- Progress must survive changing device, so one row per child per
-- activity, upserted.
create unique index if not exists progress_child_activity
  on public.progress (child_id, activity_key);
