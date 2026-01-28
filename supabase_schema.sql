-- Run this in your Supabase SQL Editor

-- 1. Create Reports Table
create table if not exists reports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid, -- nullable for anonymous reports for now
  category text not null,
  severity int not null,
  description text,
  lat float not null,
  lng float not null,
  image_url text, -- We will store Base64 here for now to avoid Storage Bucket setup friction, or a signed URL later
  image_hash text, -- Hash of image for duplicate detection
  status text default 'OPEN' check (status in ('OPEN', 'IN_PROGRESS', 'RESOLVED')),
  upvotes int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for fast duplicate lookups
create index if not exists idx_reports_image_hash on reports(image_hash);

-- 2. Enable Row Level Security (RLS)
alter table reports enable row level security;

-- 3. Create Policy: Everyone can read reports
create policy "Public reports are viewable by everyone"
  on reports for select
  using ( true );

-- 4. Create Policy: Everyone can insert reports (for this prototype)
create policy "Anyone can insert reports"
  on reports for insert
  with check ( true );

-- 5. Create Policy: Only "Officers" can update status (Simulated by Checking a Secret Key or just open for now)
-- For now, let's allow updates for simplicity in testing
create policy "Public can update upvotes"
  on reports for update
  using ( true );

-- PHASE 2 UPDATES: GAMIFICATION & OWNER
-- Add gamification columns to reports
alter table reports add column if not exists officer_id uuid;
alter table reports add column if not exists priority text default 'NORMAL';

-- Create users table for gamification
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  phone text unique,
  name text,
  xp int default 0,
  level int default 1,
  badges text[] default '{}',
  created_at timestamptz default now()
);

-- Enable RLS for users
alter table users enable row level security;

-- Users policies
create policy "Users can read own data"
    on users for select
    using ( auth.uid() = id );

create policy "Users can update own data"
    on users for update
    using ( auth.uid() = id );
