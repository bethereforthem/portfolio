-- ============================================================
-- Visitor analytics table — run once in Supabase SQL editor
-- ============================================================

CREATE TABLE IF NOT EXISTS visits (
  id           UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  page         TEXT        NOT NULL DEFAULT '/',
  country      TEXT,
  country_code TEXT,
  city         TEXT,
  visited_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Any visitor (anonymous) can insert a record
CREATE POLICY "public_insert_visits"
  ON visits FOR INSERT WITH CHECK (true);

-- Only the authenticated admin can read analytics
CREATE POLICY "auth_read_visits"
  ON visits FOR SELECT USING (auth.role() = 'authenticated');
