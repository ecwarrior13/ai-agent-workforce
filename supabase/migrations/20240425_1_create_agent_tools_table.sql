-- Create agent_tools junction table
CREATE TABLE agent_tools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
    is_enabled BOOLEAN DEFAULT true,
    tool_configuration JSONB DEFAULT '{}',
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_agent_tool UNIQUE (agent_id, tool_id)
);

-- Create indexes for faster lookups
CREATE INDEX idx_agent_tools_agent_id ON agent_tools(agent_id);
CREATE INDEX idx_agent_tools_tool_id ON agent_tools(tool_id);
CREATE INDEX idx_agent_tools_is_enabled ON agent_tools(is_enabled) WHERE is_enabled = true;

-- Add RLS policies
ALTER TABLE agent_tools ENABLE ROW LEVEL SECURITY;

-- Policy for reading agent tools (agent owner can view their agent's tools)
CREATE POLICY "Agent tools are viewable by agent owner"
    ON agent_tools FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM agents
            WHERE agents.id = agent_tools.agent_id
            AND agents.created_by = auth.uid()
        )
    );

-- Policy for inserting agent tools (agent owner can add tools to their agent)
CREATE POLICY "Agent tools can be created by agent owner"
    ON agent_tools FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM agents
            WHERE agents.id = agent_tools.agent_id
            AND agents.created_by = auth.uid()
        )
    );

-- Policy for updating agent tools (agent owner can update their agent's tools)
CREATE POLICY "Agent tools can be updated by agent owner"
    ON agent_tools FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM agents
            WHERE agents.id = agent_tools.agent_id
            AND agents.created_by = auth.uid()
        )
    );

-- Policy for deleting agent tools (agent owner can remove tools from their agent)
CREATE POLICY "Agent tools can be deleted by agent owner"
    ON agent_tools FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM agents
            WHERE agents.id = agent_tools.agent_id
            AND agents.created_by = auth.uid()
        )
    );

-- Create updated_at trigger
CREATE TRIGGER set_agent_tools_updated_at
    BEFORE UPDATE ON agent_tools
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at(); 