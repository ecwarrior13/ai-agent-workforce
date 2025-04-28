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

-- Indexes for chat_sessions
create index idx_chat_sessions_user_id on chat_sessions(user_id);
create index idx_chat_sessions_agent_id on chat_sessions(agent_id);
create index idx_chat_sessions_created_at on chat_sessions(created_at);
create index idx_chat_sessions_is_active on chat_sessions(is_active) where is_active = true;

-- Indexes for chat_messages
create index idx_chat_messages_session_id on chat_messages(session_id);
create index idx_chat_messages_created_at on chat_messages(created_at);
create index idx_chat_messages_is_summarized on chat_messages(is_summarized) where is_summarized = false;
create index idx_chat_messages_summary_group on chat_messages(summary_group_id);

-- Indexes for message_summaries
create index idx_message_summaries_session_id on message_summaries(session_id);
create index idx_message_summaries_created_at on message_summaries(created_at);

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for chat_sessions
create trigger update_chat_sessions_updated_at
  before update on chat_sessions
  for each row
  execute function update_updated_at_column();

-- Chat Sessions RLS
alter table chat_sessions enable row level security;

create policy "Users can view their own chat sessions"
  on chat_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own chat sessions"
  on chat_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own chat sessions"
  on chat_sessions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own chat sessions"
  on chat_sessions for delete
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

create policy "Users can insert messages to their sessions"
  on chat_messages for insert
  with check (
    session_id in (
      select id from chat_sessions where user_id = auth.uid()
    )
  );

create policy "Users can update messages from their sessions"
  on chat_messages for update
  using (
    session_id in (
      select id from chat_sessions where user_id = auth.uid()
    )
  );

create policy "Users can delete messages from their sessions"
  on chat_messages for delete
  using (
    session_id in (
      select id from chat_sessions where user_id = auth.uid()
    )
  );

-- Message Summaries RLS
alter table message_summaries enable row level security;

create policy "Users can view summaries from their sessions"
  on message_summaries for select
  using (
    session_id in (
      select id from chat_sessions where user_id = auth.uid()
    )
  );

create policy "Users can insert summaries to their sessions"
  on message_summaries for insert
  with check (
    session_id in (
      select id from chat_sessions where user_id = auth.uid()
    )
  );

create policy "Users can update summaries from their sessions"
  on message_summaries for update
  using (
    session_id in (
      select id from chat_sessions where user_id = auth.uid()
    )
  );

create policy "Users can delete summaries from their sessions"
  on message_summaries for delete
  using (
    session_id in (
      select id from chat_sessions where user_id = auth.uid()
    )
  );

 