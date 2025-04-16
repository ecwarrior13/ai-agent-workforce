-- Migration: create_agents_table
-- Description: Creates the agents table with necessary fields and constraints

-- Create the table
create table public.agents (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  model_id uuid references public.llm_models(id) not null,
  configuration jsonb not null default '{}',
  max_tokens integer,
  temperature float check (temperature >= 0.0 and temperature <= 1.0),
  is_premium boolean not null default false,
  chat_id uuid, -- will be referenced to chats table in future
  created_by uuid references auth.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text not null default 'draft' check (status in ('draft', 'active', 'inactive')),
  version integer not null default 1
);

-- Create indexes for common queries
create index idx_agents_created_by on public.agents(created_by);
create index idx_agents_status on public.agents(status);
create index idx_agents_model_id on public.agents(model_id);

-- Enable Row Level Security
alter table public.agents enable row level security;

-- RLS Policies
-- Users can view their own agents
create policy "Users can view their own agents"
  on public.agents for select
  using (auth.uid() = created_by);

-- Users can create their own agents
create policy "Users can create their own agents"
  on public.agents for insert
  with check (auth.uid() = created_by);

-- Users can update their own agents
create policy "Users can update their own agents"
  on public.agents for update
  using (auth.uid() = created_by);

-- Users can delete their own agents
create policy "Users can delete their own agents"
  on public.agents for delete
  using (auth.uid() = created_by);

-- Add updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on public.agents
  for each row
  execute function public.handle_updated_at(); 