-- Migration: create_llm_models_table
-- Description: Creates the llm_models table with necessary fields and constraints

-- Create the table
create table public.llm_models (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  api_model_name text not null,
  max_tokens text,
  premium boolean not null default false,
  disabled boolean default false,
  image boolean default false,
  notes text,
  provider text not null,
  experimental boolean not null default false,
  sort_order integer not null,
  supports_streaming boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for common queries
create index idx_llm_models_provider on public.llm_models(provider);
create index idx_llm_models_premium on public.llm_models(premium);
create index idx_llm_models_sort_order on public.llm_models(sort_order);
create index idx_llm_models_disabled on public.llm_models(disabled);

-- Enable Row Level Security
alter table public.llm_models enable row level security;

-- RLS Policies
-- Allow all authenticated users to view available models
create policy "Users can view available models"
  on public.llm_models for select
  using (disabled = false);

-- Only allow service role to modify models
create policy "Only service role can modify models"
  on public.llm_models for all
  using (auth.role() = 'service_role');

-- Add updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on public.llm_models
  for each row
  execute function public.handle_updated_at(); 