-- Run this in your Supabase SQL Editor

-- 1. Create Reports Table
create table reports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid, -- nullable for anonymous reports for now
  category text not null,
  severity int not null,
  description text,
  lat float not null,
  lng float not null,
  image_url text, -- We will store Base64 here for now to avoid Storage Bucket setup friction, or a signed URL later
  status text default 'OPEN' check (status in ('OPEN', 'IN_PROGRESS', 'RESOLVED')),
  upvotes int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

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
