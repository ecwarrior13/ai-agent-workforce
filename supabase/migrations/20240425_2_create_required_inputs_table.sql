-- Create enum for input types
CREATE TYPE input_type AS ENUM (
    'text',
    'number',
    'url',
    'email',
    'date',
    'select',
    'multiselect',
    'file',
    'textarea'
);

-- Create required_inputs table
CREATE TABLE required_inputs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    label VARCHAR(255) NOT NULL,
    description TEXT,
    type input_type NOT NULL,
    is_required BOOLEAN DEFAULT true,
    is_premium BOOLEAN DEFAULT false,
    validation_rules JSONB DEFAULT '{}',
    options JSONB DEFAULT '[]', -- For select/multiselect types
    placeholder TEXT,
    default_value TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_input_name_per_agent UNIQUE (agent_id, name),
    CONSTRAINT unique_order_per_agent UNIQUE (agent_id, order_index)
);

-- Create indexes for faster lookups
CREATE INDEX idx_required_inputs_agent_id ON required_inputs(agent_id);
CREATE INDEX idx_required_inputs_type ON required_inputs(type);
CREATE INDEX idx_required_inputs_is_premium ON required_inputs(is_premium);
CREATE INDEX idx_required_inputs_order ON required_inputs(agent_id, order_index);

-- Add RLS policies
ALTER TABLE required_inputs ENABLE ROW LEVEL SECURITY;

-- Policy for reading required inputs (agent owner can view their agent's inputs)
CREATE POLICY "Required inputs are viewable by agent owner"
    ON required_inputs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM agents
            WHERE agents.id = required_inputs.agent_id
            AND agents.created_by = auth.uid()
        )
    );

-- Policy for inserting required inputs (agent owner can add inputs to their agent)
CREATE POLICY "Required inputs can be created by agent owner"
    ON required_inputs FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM agents
            WHERE agents.id = required_inputs.agent_id
            AND agents.created_by = auth.uid()
        )
    );

-- Policy for updating required inputs (agent owner can update their agent's inputs)
CREATE POLICY "Required inputs can be updated by agent owner"
    ON required_inputs FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM agents
            WHERE agents.id = required_inputs.agent_id
            AND agents.created_by = auth.uid()
        )
    );

-- Policy for deleting required inputs (agent owner can remove inputs from their agent)
CREATE POLICY "Required inputs can be deleted by agent owner"
    ON required_inputs FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM agents
            WHERE agents.id = required_inputs.agent_id
            AND agents.created_by = auth.uid()
        )
    );

-- Create updated_at trigger
CREATE TRIGGER set_required_inputs_updated_at
    BEFORE UPDATE ON required_inputs
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at(); 