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

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

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
