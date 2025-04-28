-- Create function to set updated_at timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create enum for task types
CREATE TYPE task_type AS ENUM (
    'input',
    'file_upload',
    'selection',
    'validation'
);

-- Create enum for task source
CREATE TYPE task_source AS ENUM (
    'user',
    'ai_agent'
);

-- Create enum for system type
CREATE TYPE system_type AS ENUM (
    'basic',
    'premium'
);

-- Add system_type to agents table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'system_type') THEN
        CREATE TYPE system_type AS ENUM ('basic', 'premium');
    END IF;
END $$;

ALTER TABLE agents ADD COLUMN IF NOT EXISTS system_type system_type DEFAULT 'basic';

-- Create tasks table
CREATE TABLE tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type task_type NOT NULL,
    validation_rules JSONB,
    is_required BOOLEAN DEFAULT true,
    task_order INTEGER NOT NULL,
    source task_source NOT NULL DEFAULT 'user',
    can_user_update BOOLEAN DEFAULT true,
    can_user_delete BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_task_order_per_agent UNIQUE (agent_id, task_order)
);

-- Create index for faster lookups
CREATE INDEX idx_tasks_agent_id ON tasks(agent_id);

-- Add RLS policies
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy for reading tasks (viewable by everyone)
CREATE POLICY "Tasks are viewable by everyone"
    ON tasks FOR SELECT
    USING (true);

-- Policy for inserting tasks (users can create tasks for their own agents, AI agents can create tasks)
CREATE POLICY "Tasks can be created by agent owner or AI agent"
    ON tasks FOR INSERT
    WITH CHECK (
        -- User is the agent owner
        EXISTS (
            SELECT 1 FROM agents
            WHERE agents.id = tasks.agent_id
            AND agents.created_by = auth.uid()
        )
        OR
        -- Task is created by AI agent
        tasks.source = 'ai_agent'
    );

-- Policy for updating tasks (users can update tasks for their own agents if allowed, AI agents can update their tasks)
CREATE POLICY "Tasks can be updated by agent owner or AI agent"
    ON tasks FOR UPDATE
    USING (
        -- User is the agent owner and task allows user updates
        (
            EXISTS (
                SELECT 1 FROM agents
                WHERE agents.id = tasks.agent_id
                AND agents.created_by = auth.uid()
            )
            AND can_user_update = true
        )
        OR
        -- Task is owned by AI agent
        source = 'ai_agent'
    );

-- Policy for deleting tasks (users can delete tasks for their own agents if allowed, AI agents can delete their tasks)
CREATE POLICY "Tasks can be deleted by agent owner or AI agent"
    ON tasks FOR DELETE
    USING (
        -- User is the agent owner and task allows user deletion
        (
            EXISTS (
                SELECT 1 FROM agents
                WHERE agents.id = tasks.agent_id
                AND agents.created_by = auth.uid()
            )
            AND can_user_delete = true
        )
        OR
        -- Task is owned by AI agent
        source = 'ai_agent'
    );

-- Create updated_at trigger
CREATE TRIGGER set_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at(); 