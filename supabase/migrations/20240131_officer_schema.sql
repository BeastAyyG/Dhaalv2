-- Officer Schema Migration: 20240131_officer_schema.sql

-- 1. Create Role Enum (Idempotent)
do $$ 
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('citizen', 'official', 'admin');
  end if;
end $$;

-- 2. Add Role to Users Table
alter table users add column if not exists role user_role default 'citizen';

-- 3. Create Reports Assignments Table
create table if not exists report_assignments (
  id uuid default gen_random_uuid() primary key,
  report_id uuid references reports(id) on delete cascade not null,
  officer_id uuid references users(id) on delete cascade not null,
  assigned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'ACTIVE' check (status in ('ACTIVE', 'COMPLETED', 'TRANSFERRED')),
  unique(report_id, officer_id) -- Prevent duplicate assignment
);

-- 4. Create Report Updates Table (For Official Progress)
create table if not exists report_updates (
  id uuid default gen_random_uuid() primary key,
  report_id uuid references reports(id) on delete cascade not null,
  officer_id uuid references users(id) on delete set null,
  image_url text,
  description text,
  type text default 'progress' check (type in ('progress', 'resolution', 'note')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Enable RLS
alter table report_assignments enable row level security;
alter table report_updates enable row level security;

-- 6. RLS Policies

-- ASSIGNMENTS
-- Officials can view their own assignments
create policy "Officials can view own assignments"
  on report_assignments for select
  using ( auth.uid() = officer_id );

-- Admins can view all assignments
create policy "Admins can view all assignments"
  on report_assignments for select
  using ( exists (select 1 from users where id = auth.uid() and role = 'admin') );

-- Officials can assign themselves (Self-assign)
create policy "Officials can self-assign"
  on report_assignments for insert
  with check ( 
    auth.uid() = officer_id 
    and exists (select 1 from users where id = auth.uid() and role = 'official')
  );

-- UPDATES
-- Everyone can read updates (Public transparency)
create policy "Public can read report updates"
  on report_updates for select
  using ( true );

-- Officials can insert updates
create policy "Officials can post updates"
  on report_updates for insert
  with check ( exists (select 1 from users where id = auth.uid() and role in ('official', 'admin')) );

-- 7. Add Indexes for Performance
create index if not exists idx_users_role on users(role);
create index if not exists idx_assignments_officer on report_assignments(officer_id);
create index if not exists idx_updates_report on report_updates(report_id);
