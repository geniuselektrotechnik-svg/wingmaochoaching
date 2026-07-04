-- Add phone and industry columns to assessments table
ALTER TABLE assessments 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT;

-- Update existing records to have empty strings instead of NULL
UPDATE assessments 
SET phone = COALESCE(phone, ''),
    industry = COALESCE(industry, '')
WHERE phone IS NULL OR industry IS NULL;
