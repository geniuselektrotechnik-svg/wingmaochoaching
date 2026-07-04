-- Füge cancellation_token Spalte zu appointments Tabelle hinzu
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS cancellation_token TEXT UNIQUE;

-- Index für schnellere Token-Suche
CREATE INDEX IF NOT EXISTS idx_appointments_cancellation_token 
ON appointments(cancellation_token);
