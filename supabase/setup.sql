-- Run once, in a dedicated Supabase project for My Wall.
begin;
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  body text not null check (body ~ '[^[:space:]]' and char_length(body) <= 280),
  created_at timestamptz not null default now()
);
create index posts_feed_idx on public.posts (created_at desc, id desc);
alter table public.posts enable row level security;
revoke all on public.posts from public, anon, authenticated;
grant select on public.posts to anon, authenticated;
grant insert (body) on public.posts to anon, authenticated;
create policy "Visitors can read wall posts" on public.posts
  for select to anon, authenticated using (true);
create policy "Visitors can share guest posts" on public.posts
  for insert to anon, authenticated with check (user_id is null);
alter publication supabase_realtime add table public.posts;
commit;
