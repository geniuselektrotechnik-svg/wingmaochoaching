-- Create payments table to track all payment transactions
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  stripe_payment_id TEXT,
  assessment_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_payments_email ON payments(customer_email);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- Enable Row Level Security
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access only
CREATE POLICY "Admin can view all payments"
  ON payments
  FOR SELECT
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add payment_id reference to appointments if needed
ALTER TABLE appointments 
  ADD COLUMN IF NOT EXISTS payment_id UUID REFERENCES payments(id);

COMMENT ON TABLE payments IS 'Tracks all payment transactions for assessments';
COMMENT ON COLUMN payments.status IS 'Payment status: pending, completed, failed, or refunded';
COMMENT ON COLUMN payments.assessment_completed IS 'Whether the assessment was completed after payment';
