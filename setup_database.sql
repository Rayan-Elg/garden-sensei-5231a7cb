create table public.plants (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    species text,
    moisture integer,
    light integer,
    last_watered timestamp with time zone,
    image text,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.plants enable row level security;

-- Allow public access for now (you might want to restrict this in production)
create policy "Allow public access" on public.plants
    for all
    to anon
    using (true)
    with check (true);

-- Create storage bucket for plant images
insert into storage.buckets (id, name, public)
values ('plants', 'plants', true)
on conflict (id) do nothing;

-- Enable public access to the storage bucket
create policy "Public Access"
on storage.objects for all
to public
using ( bucket_id = 'plants' );

-- Allow uploads to the plants bucket
create policy "Allow uploads"
on storage.objects for insert
to public
with check ( bucket_id = 'plants' );

