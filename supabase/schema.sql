-- CodeMentor AI — 数据库 schema（可重复执行）
-- 在 Supabase 控制台 SQL Editor 中整段执行
-- 内容：对话历史表 conversations + 身份表 profiles（学生/教师隔离）

-- ── 对话历史：每个用户、每种语言保留最近 15 条（一句问 + 一句答 = 1 条）──
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  language text not null,
  student_message text not null,
  ai_message text not null,
  code text,
  created_at timestamptz not null default now()
);

alter table public.conversations enable row level security;

drop policy if exists "users manage own conversations" on public.conversations;
create policy "users manage own conversations"
  on public.conversations
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "teachers read all conversations" on public.conversations;
create policy "teachers read all conversations"
  on public.conversations
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.user_id = auth.uid() and p.role = 'teacher'
    )
  );

create index if not exists conversations_user_lang_time_idx
  on public.conversations (user_id, language, created_at desc);

-- 插入后自动 trim：每个 (user, language) 只保留最近 15 条
create or replace function public.trim_conversations()
returns trigger
language plpgsql
as $$
begin
  delete from public.conversations
  where user_id = new.user_id
    and language = new.language
    and created_at < (
      select created_at
      from public.conversations
      where user_id = new.user_id
        and language = new.language
      order by created_at desc
      offset 14
      limit 1
    );
  return new;
end;
$$;

drop trigger if exists trim_conversations_after_insert on public.conversations;
create trigger trim_conversations_after_insert
  after insert on public.conversations
  for each row
  execute function public.trim_conversations();

-- ── 身份档案：学生 / 教师隔离，同一邮箱只能持有一种身份 ──
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('student', 'teacher')),
  email text not null default '',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- 本人可读自己的 profile；教师可读全部（看板需要学生邮箱与人数）
drop policy if exists "profiles readable by owner and teachers" on public.profiles;
create policy "profiles readable by owner and teachers"
  on public.profiles
  for select
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.profiles p
      where p.user_id = auth.uid() and p.role = 'teacher'
    )
  );

drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own"
  on public.profiles
  for insert
  with check (auth.uid() = user_id);
