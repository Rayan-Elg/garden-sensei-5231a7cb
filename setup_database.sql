
create table public.plants (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    species text,
    moisture integer,
    light integer,
    temperature integer,
    last_watered timestamp with time zone,
    image text,
    description text,
    user_id uuid references auth.users not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    care_water text,
    care_humidity text,
    care_light text,
    care_soil text,
    care_temperature text,
    care_fertilizer text,
    care_warnings text
);

-- Create a new profiles table to store user phone numbers
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    phone_number text,
    sms_notifications boolean default true,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create a trigger to create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

-- Set up the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Row Level Security (RLS)
alter table public.plants enable row level security;
alter table public.profiles enable row level security;

-- Allow authenticated users to access only their own plants
create policy "Users can manage their own plants"
  on plants for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Allow users to read/write their own profile
create policy "Users can view own profile"
  on profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  to authenticated
  using (auth.uid() = id);

-- Create storage bucket for plant images
insert into storage.buckets (id, name, public)
values ('plants', 'plants', true)
on conflict (id) do nothing;

-- Enable public access to the storage bucket
create policy "Public Access"
on storage.objects for all
to public
using (bucket_id = 'plants');

-- Allow uploads to the plants bucket
create policy "Allow uploads"
on storage.objects for insert
to public
with check (bucket_id = 'plants');

