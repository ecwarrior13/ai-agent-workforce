create table chat_sessions (
  id uuid default gen_random_uuid() primary key,
  agent_id uuid references agents(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  summary text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  is_active boolean default true
);

create table chat_messages (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references chat_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  tokens_used integer,
  created_at timestamp with time zone default now(),
  is_summarized boolean default false,
  summary_group_id uuid -- references to summarized messages
);

create table message_summaries (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references chat_sessions(id) on delete cascade,
  summary_content text not null,
  original_messages_start_id uuid references chat_messages(id),
  original_messages_end_id uuid references chat_messages(id),
  created_at timestamp with time zone default now(),
  tokens_used integer
);

create index idx_chat_sessions_user_id on chat_sessions(user_id);
create index idx_chat_sessions_agent_id on chat_sessions(agent_id);

-- For message queries
create index idx_chat_messages_session_id on chat_messages(session_id);
create index idx_chat_messages_created_at on chat_messages(created_at);

-- Chat Sessions RLS
alter table chat_sessions enable row level security;
create policy "Users can view their own chat sessions"
  on chat_sessions for select
  using (auth.uid() = user_id);

-- Chat Messages RLS
alter table chat_messages enable row level security;
create policy "Users can view messages from their sessions"
  on chat_messages for select
  using (
    session_id in (
      select id from chat_sessions where user_id = auth.uid()
    )
  );

 