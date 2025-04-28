-- Create enum for completion status
CREATE TYPE completion_status AS ENUM (
    'pending',
    'completed',
    'failed'
);

-- Create task completions table
CREATE TABLE task_completions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    completion_data JSONB NOT NULL,
    status completion_status DEFAULT 'pending' NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_task_completion UNIQUE (task_id, user_id, agent_id)
);

-- Create indexes for faster lookups
CREATE INDEX idx_task_completions_task_id ON task_completions(task_id);
CREATE INDEX idx_task_completions_user_id ON task_completions(user_id);
CREATE INDEX idx_task_completions_agent_id ON task_completions(agent_id);

-- Add RLS policies
ALTER TABLE task_completions ENABLE ROW LEVEL SECURITY;

-- Policy for reading task completions (user can see their own, agent owner can see all for their agent)
CREATE POLICY "Task completions are viewable by owner and agent owner"
    ON task_completions FOR SELECT
    USING (
        auth.uid() = user_id
        OR
        EXISTS (
            SELECT 1 FROM agents
            WHERE agents.id = task_completions.agent_id
            AND agents.created_by = auth.uid()
        )
    );

-- Policy for inserting task completions (user can create their own)
CREATE POLICY "Task completions can be created by user"
    ON task_completions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy for updating task completions (user can update their own, agent owner can update for their agent)
CREATE POLICY "Task completions can be updated by owner and agent owner"
    ON task_completions FOR UPDATE
    USING (
        auth.uid() = user_id
        OR
        EXISTS (
            SELECT 1 FROM agents
            WHERE agents.id = task_completions.agent_id
            AND agents.created_by = auth.uid()
        )
    );

-- Policy for deleting task completions (user can delete their own, agent owner can delete for their agent)
CREATE POLICY "Task completions can be deleted by owner and agent owner"
    ON task_completions FOR DELETE
    USING (
        auth.uid() = user_id
        OR
        EXISTS (
            SELECT 1 FROM agents
            WHERE agents.id = task_completions.agent_id
            AND agents.created_by = auth.uid()
        )
    );

-- Create updated_at trigger
CREATE TRIGGER set_task_completions_updated_at
    BEFORE UPDATE ON task_completions
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at(); 