-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  last_login TIMESTAMP
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Nur Service Role kann diese Tabelle lesen
CREATE POLICY "service_role_full_access" ON admin_users
  FOR ALL
  USING (auth.role() = 'service_role');

-- Create admin_sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_sessions" ON admin_sessions
  FOR ALL
  USING (auth.role() = 'service_role');
