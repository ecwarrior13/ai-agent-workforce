-- Create tools table
CREATE TABLE tools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    is_premium BOOLEAN DEFAULT false,
    rate_limit INTEGER DEFAULT 100,
    configuration JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for faster lookups
CREATE INDEX idx_tools_is_active ON tools(is_active);
CREATE INDEX idx_tools_is_premium ON tools(is_premium);

-- Add RLS policies
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Policy for reading tools (viewable by everyone)
CREATE POLICY "Tools are viewable by everyone"
    ON tools FOR SELECT
    USING (true);

-- Policy for inserting tools (only admin users)
CREATE POLICY "Tools can be created by admin users"
    ON tools FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.isAdmin = true
        )
    );

-- Policy for updating tools (only admin users)
CREATE POLICY "Tools can be updated by admin users"
    ON tools FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.isAdmin = true
        )
    );

-- Policy for deleting tools (only admin users)
CREATE POLICY "Tools can be deleted by admin users"
    ON tools FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.isAdmin = true
        )
    );

-- Create updated_at trigger
CREATE TRIGGER set_tools_updated_at
    BEFORE UPDATE ON tools
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at(); 