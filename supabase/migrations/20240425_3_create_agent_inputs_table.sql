-- Create agent_inputs table
CREATE TABLE agent_inputs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    required_input_id UUID NOT NULL REFERENCES required_inputs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    chat_session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    input_data JSONB NOT NULL, -- Store different types of values (text, number, array, etc.)
    is_valid BOOLEAN DEFAULT true,
    validation_errors JSONB DEFAULT '[]',
    last_validated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_input_per_agent UNIQUE (agent_id, required_input_id, user_id)
);

-- Create indexes for faster lookups
CREATE INDEX idx_agent_inputs_agent_id ON agent_inputs(agent_id);
CREATE INDEX idx_agent_inputs_required_input_id ON agent_inputs(required_input_id);
CREATE INDEX idx_agent_inputs_user_id ON agent_inputs(user_id);
CREATE INDEX idx_agent_inputs_is_valid ON agent_inputs(is_valid) WHERE is_valid = true;

-- Add RLS policies
ALTER TABLE agent_inputs ENABLE ROW LEVEL SECURITY;

-- Policy for reading agent inputs (user can view their own inputs)
CREATE POLICY "Agent inputs are viewable by user"
    ON agent_inputs FOR SELECT
    USING (auth.uid() = user_id);

-- Policy for inserting agent inputs (user can create their own inputs)
CREATE POLICY "Agent inputs can be created by user"
    ON agent_inputs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy for updating agent inputs (user can update their own inputs)
CREATE POLICY "Agent inputs can be updated by user"
    ON agent_inputs FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy for deleting agent inputs (user can delete their own inputs)
CREATE POLICY "Agent inputs can be deleted by user"
    ON agent_inputs FOR DELETE
    USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER set_agent_inputs_updated_at
    BEFORE UPDATE ON agent_inputs
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at(); 


       -- Index for querying by chat_session_id
   CREATE INDEX idx_agent_inputs_chat_session_id ON agent_inputs(chat_session_id);
   
   -- Index for the JSONB data if you'll query it frequently
   CREATE INDEX idx_agent_inputs_input_data ON agent_inputs USING GIN (input_data);
      -- Add if you want to implement soft delete
   ALTER TABLE agent_inputs ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
      -- Add if you want to track the status of inputs
   ALTER TABLE agent_inputs ADD COLUMN status VARCHAR(20) DEFAULT 'pending';