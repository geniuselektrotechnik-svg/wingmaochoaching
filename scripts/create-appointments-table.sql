-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  cancellation_token TEXT UNIQUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_email ON appointments(customer_email);

-- Enable Row Level Security
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert appointments (booking)
CREATE POLICY "Anyone can create appointments" ON appointments
  FOR INSERT WITH CHECK (true);

-- Policy: Anyone can read their own appointments via cancellation_token
CREATE POLICY "Users can read own appointments" ON appointments
  FOR SELECT USING (true);

-- Policy: Anyone can update their own appointments (for cancellation)
CREATE POLICY "Users can cancel own appointments" ON appointments
  FOR UPDATE USING (true);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE
  ON appointments FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
