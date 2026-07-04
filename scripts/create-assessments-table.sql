-- Create assessments table for storing user data and results
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User Info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  
  -- Assessment Data
  answers JSONB,
  scores JSONB,
  entrepreneur_type TEXT,
  ai_analysis JSONB,
  
  -- Tracking
  cta_clicked BOOLEAN DEFAULT FALSE,
  cta_clicked_at TIMESTAMP WITH TIME ZONE,
  pdf_downloaded BOOLEAN DEFAULT FALSE,
  pdf_downloaded_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Add index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_assessments_email ON assessments(email);

-- Add index on created_at for admin dashboard sorting
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (create new assessment)
CREATE POLICY "Anyone can create assessments"
  ON assessments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Users can read their own assessment by email
CREATE POLICY "Users can read own assessments"
  ON assessments
  FOR SELECT
  TO anon, authenticated
  USING (email = current_setting('request.jwt.claims')::json->>'email' OR auth.role() = 'anon');

-- Policy: Users can update their own assessment
CREATE POLICY "Users can update own assessments"
  ON assessments
  FOR UPDATE
  TO anon, authenticated
  USING (email = current_setting('request.jwt.claims')::json->>'email' OR auth.role() = 'anon')
  WITH CHECK (email = current_setting('request.jwt.claims')::json->>'email' OR auth.role() = 'anon');

-- Admin can view all (for admin panel)
CREATE POLICY "Admin can view all assessments"
  ON assessments
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt()->>'role' = 'admin' OR 
    auth.jwt()->>'email' IN (
      'admin@wingman-coaching.de',
      'info@wingman-coaching.de'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_assessments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_assessments_updated_at();
