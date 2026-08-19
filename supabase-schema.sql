-- ===================================================================
-- The Talking Garden — database schema
-- Dew of Heaven Children's Garden
--
-- Paste this whole file into Supabase → SQL Editor → Run.
-- Safe to re-run.
-- ===================================================================

-- ---------- children ------------------------------------------------
-- Kids never get their own login. A parent creates a row per child,
-- first name + grade only. This is what keeps per-child reporting
-- possible without collecting personal data on minors.
create table if not exists public.children (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  grade       text,
  created_at  timestamptz not null default now()
);
create index if not exists children_parent_idx on public.children(parent_id);

-- ---------- topics --------------------------------------------------
create table if not exists public.topics (
  slug        text primary key,
  name        text not null,
  blurb       text,
  emoji       text,
  sort_order  int  not null default 0,
  published   boolean not null default false
);

-- ---------- live sessions -------------------------------------------
-- One row per scheduled live workshop. join_url is the ED's fixed
-- Zoom personal meeting link. garden_word is spoken aloud during the
-- session and is what unlocks the topic afterwards.
create table if not exists public.sessions (
  id            uuid primary key default gen_random_uuid(),
  topic_slug    text not null references public.topics(slug) on delete cascade,
  starts_at     timestamptz not null,
  join_url      text,
  garden_word   text,
  recording_url text,
  created_at    timestamptz not null default now()
);
create index if not exists sessions_topic_idx on public.sessions(topic_slug);

-- ---------- attendance / unlock -------------------------------------
-- The unlock record. Today it is written when a family types the
-- garden word. If Zoom webhooks are added later they write the same
-- row with method='zoom' — nothing else has to change.
create table if not exists public.attendance (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid not null references auth.users(id) on delete cascade,
  topic_slug  text not null references public.topics(slug) on delete cascade,
  session_id  uuid references public.sessions(id) on delete set null,
  method      text not null default 'garden_word',
  created_at  timestamptz not null default now(),
  unique (parent_id, topic_slug)
);

-- ---------- quiz results (the grant-reporting table) ----------------
-- Same instrument taken twice. phase='pre' before the live session,
-- phase='post' after. The difference is the learning gain.
create table if not exists public.quiz_results (
  id          uuid primary key default gen_random_uuid(),
  child_id    uuid not null references public.children(id) on delete cascade,
  topic_slug  text not null references public.topics(slug) on delete cascade,
  phase       text not null check (phase in ('pre','post')),
  score       int  not null,
  out_of      int  not null,
  taken_at    timestamptz not null default now(),
  unique (child_id, topic_slug, phase)
);

-- ---------- activity progress ---------------------------------------
create table if not exists public.progress (
  id            uuid primary key default gen_random_uuid(),
  child_id      uuid not null references public.children(id) on delete cascade,
  topic_slug    text not null references public.topics(slug) on delete cascade,
  activity_key  text not null,
  completed_at  timestamptz not null default now(),
  unique (child_id, activity_key)
);

-- ===================================================================
-- Row Level Security — a family can only ever see its own rows.
-- ===================================================================
alter table public.children     enable row level security;
alter table public.attendance   enable row level security;
alter table public.quiz_results enable row level security;
alter table public.progress     enable row level security;
alter table public.topics       enable row level security;
alter table public.sessions     enable row level security;

-- children: owned by the parent
drop policy if exists children_own on public.children;
create policy children_own on public.children
  for all using (parent_id = auth.uid()) with check (parent_id = auth.uid());

-- attendance: owned by the parent
drop policy if exists attendance_own on public.attendance;
create policy attendance_own on public.attendance
  for all using (parent_id = auth.uid()) with check (parent_id = auth.uid());

-- quiz results: reachable through the parent's own children
drop policy if exists quiz_own on public.quiz_results;
create policy quiz_own on public.quiz_results
  for all using (
    exists (select 1 from public.children c where c.id = child_id and c.parent_id = auth.uid())
  ) with check (
    exists (select 1 from public.children c where c.id = child_id and c.parent_id = auth.uid())
  );

drop policy if exists progress_own on public.progress;
create policy progress_own on public.progress
  for all using (
    exists (select 1 from public.children c where c.id = child_id and c.parent_id = auth.uid())
  ) with check (
    exists (select 1 from public.children c where c.id = child_id and c.parent_id = auth.uid())
  );

-- topics + sessions: readable by any signed-in family, writable only
-- from the Supabase dashboard (or a later admin UI using a role).
drop policy if exists topics_read on public.topics;
create policy topics_read on public.topics
  for select using (auth.role() = 'authenticated');

drop policy if exists sessions_read on public.sessions;
create policy sessions_read on public.sessions
  for select using (auth.role() = 'authenticated');

-- ===================================================================
-- Seed the six topics
-- ===================================================================
insert into public.topics (slug, name, emoji, blurb, sort_order, published) values
  ('plant',      'Plant Life Cycle',     '🌻', 'From a seed the size of a freckle to a sunflower taller than you.', 1, true),
  ('butterfly',  'Butterfly Life Cycle', '🦋', 'Egg, caterpillar, chrysalis, butterfly.',                            2, true),
  ('frog',       'Frog Life Cycle',      '🐸', 'Tadpoles growing legs, lungs, and a very loud voice.',               3, true),
  ('worm',       'Worms & Living Soil',  '🪱', 'How a worm turns a banana peel into next year''s tomatoes.',         4, false),
  ('pollinator', 'Pollinators at Work',  '🐝', 'No bees, no strawberries.',                                          5, false),
  ('kitchen',    'Garden to Kitchen',    '🥕', 'Trace real food back to roots, stems, leaves and flowers.',          6, false)
on conflict (slug) do nothing;

-- ===================================================================
-- The grant report: average pre/post gain per topic.
--   select * from public.learning_gain;
-- ===================================================================
create or replace view public.learning_gain as
select
  t.slug,
  t.name                                                     as topic,
  count(distinct pre.child_id)                               as children,
  round(avg(pre.score::numeric  / nullif(pre.out_of,0))*100)  as avg_before_pct,
  round(avg(post.score::numeric / nullif(post.out_of,0))*100) as avg_after_pct,
  round(avg(post.score::numeric / nullif(post.out_of,0))*100)
    - round(avg(pre.score::numeric / nullif(pre.out_of,0))*100) as gain_pts
from public.topics t
join public.quiz_results pre  on pre.topic_slug  = t.slug and pre.phase  = 'pre'
join public.quiz_results post on post.topic_slug = t.slug and post.phase = 'post'
                             and post.child_id   = pre.child_id
group by t.slug, t.name;
