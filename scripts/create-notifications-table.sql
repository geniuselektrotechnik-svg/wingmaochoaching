-- Notifications Tabelle fuer Admin Benachrichtigungen
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- 'assessment_started', 'appointment_booked'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_id UUID, -- ID des Assessments oder Appointments
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index fuer schnelle Abfragen
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- RLS Policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Admin kann alle Notifications sehen
CREATE POLICY "Admin can view all notifications"
  ON notifications
  FOR SELECT
  USING (true);

-- System kann Notifications erstellen
CREATE POLICY "System can create notifications"
  ON notifications
  FOR INSERT
  WITH CHECK (true);

-- Admin kann Notifications als gelesen markieren
CREATE POLICY "Admin can update notifications"
  ON notifications
  FOR UPDATE
  USING (true);
