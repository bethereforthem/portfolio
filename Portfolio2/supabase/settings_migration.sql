-- ============================================================
-- Settings table migration — run once in Supabase SQL editor
-- ============================================================

CREATE TABLE IF NOT EXISTS settings (
  key        TEXT        PRIMARY KEY,
  value      TEXT        NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_settings"   ON settings FOR SELECT USING (true);
CREATE POLICY "auth_update_settings"   ON settings FOR UPDATE USING    (auth.role() = 'authenticated');
CREATE POLICY "auth_insert_settings"   ON settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE TRIGGER trg_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed initial values (update these to match your real Drive links)
INSERT INTO settings (key, value) VALUES
  ('cv_url',     'https://drive.google.com/file/d/1p0vtLOFIRAbKdRlntai_nsJHeJfdyl8x/view?usp=drive_link'),
  ('resume_url', 'https://drive.google.com/file/d/1AMnxqQogoq--IbhPA2pl6Y_QaX-dNNeB/view?usp=drive_link')
ON CONFLICT (key) DO NOTHING;
