-- Drop existing objects first
drop policy if exists "Allow public access" on public.plants;
drop policy if exists "Users can view own plants" on public.plants;
drop policy if exists "Users can insert own plants" on public.plants;
drop policy if exists "Users can update own plants" on public.plants;
drop policy if exists "Users can delete own plants" on public.plants;
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can view own plant images" on storage.objects;
drop policy if exists "Users can upload own plant images" on storage.objects;
drop policy if exists "Users can update own plant images" on storage.objects;
drop policy if exists "Users can delete own plant images" on storage.objects;

-- Drop existing triggers
drop trigger if exists on_auth_user_created on auth.users;

-- Drop existing tables (in correct order due to dependencies)
drop table if exists public.plants;
drop table if exists public.profiles;

-- Create tables
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    phone_number text,
    sms_notifications boolean default true,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.plants (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    species text,
    moisture integer,
    light integer,
    last_watered timestamp with time zone,
    image text,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    care_water text,
    care_humidity text,
    care_light text,
    care_soil text,
    care_temperature text,
    care_fertilizer text,
    care_warnings text
);

-- Enable RLS
alter table public.plants enable row level security;
alter table public.profiles enable row level security;

-- Create RLS policies for plants
create policy "Users can view own plants"
  on public.plants for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own plants"
  on public.plants for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own plants"
  on public.plants for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete own plants"
  on public.plants for delete
  to authenticated
  using (auth.uid() = user_id);

-- Create policies for profiles
create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using ( auth.uid() = id );

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using ( auth.uid() = id );

-- Create trigger function for new users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Create trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up storage
-- Create bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('plants', 'plants', true)
on conflict (id) do nothing;

-- Create storage policies
create policy "Users can view own plant images"
  on storage.objects for select
  to authenticated
  using ( bucket_id = 'plants' AND (storage.foldername(name))[1] = auth.uid()::text );

create policy "Users can upload own plant images"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'plants' AND (storage.foldername(name))[1] = auth.uid()::text );

create policy "Users can update own plant images"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'plants' AND (storage.foldername(name))[1] = auth.uid()::text );

create policy "Users can delete own plant images"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'plants' AND (storage.foldername(name))[1] = auth.uid()::text );
