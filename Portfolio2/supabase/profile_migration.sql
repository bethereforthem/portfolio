-- ============================================================
-- Profile & Social Links migration — run once in Supabase SQL editor
-- ============================================================

-- Add profile settings keys to existing settings table
INSERT INTO settings (key, value) VALUES
  ('full_name',       'David Kayigamba'),
  ('bio',             'I am a qualified man with professional ethics. It is now 2 years in University of Rwanda. I hold an advanced certificate of education (A2) in Mathematics-Physics-Computer Science. Throughout this learning journey, I have developed good communication skills, time management, and problem solving skills. I am always eager to learn and earn more skills.'),
  ('profile_image',   '/images/david2.png'),
  ('phone',           '+250 781 042 421'),
  ('email',           'davidkayigamba2@gmail.com'),
  ('whatsapp_link',   'https://wa.me/+250781042421'),
  ('location',        'Kigali, Rwanda'),
  ('about_location',  'Musanze, Rwanda'),
  ('contact_address', 'Musanze, Rwanda'),
  ('working_hours',   'Mon-Fri, 9AM - 5PM'),
  ('university',      'University of Rwanda Student'),
  ('linkedin_url',    'https://www.linkedin.com/in/david-kayigamba-86405430a/'),
  ('linkedin_label',  'David Kayigamba'),
  ('welcome_text',    'I am motivated by the potential for software to change the world and I want to be a part of that change. As a software engineer, I have the opportunity to use my technical skills and problem-solving abilities to design and develop solutions that make a positive impact on people''s lives.')
ON CONFLICT (key) DO NOTHING;

-- ── Social Links table ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS social_links (
  id         UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  label      TEXT        NOT NULL,
  url        TEXT        NOT NULL,
  icon       TEXT        DEFAULT 'fas fa-link',
  color      TEXT        DEFAULT 'text-gray-600',
  sort_order INTEGER     DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_social_links"  ON social_links FOR SELECT USING (true);
CREATE POLICY "auth_insert_social_links"  ON social_links FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_social_links"  ON social_links FOR UPDATE USING    (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_social_links"  ON social_links FOR DELETE USING    (auth.role() = 'authenticated');

-- Seed default social link (LinkedIn)
INSERT INTO social_links (label, url, icon, color, sort_order)
VALUES ('LinkedIn', 'https://www.linkedin.com/in/david-kayigamba-86405430a/', 'fab fa-linkedin', 'text-blue-700', 1)
ON CONFLICT DO NOTHING;
