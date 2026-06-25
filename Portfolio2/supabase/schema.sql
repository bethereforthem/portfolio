-- ============================================================
-- Portfolio Management System — Supabase Schema
-- Run this entire file in your Supabase SQL editor once.
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Projects ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id              UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  title           TEXT        NOT NULL,
  description     TEXT        DEFAULT '',
  technologies    TEXT[]      DEFAULT '{}',
  image           TEXT        DEFAULT '',
  github_link     TEXT        DEFAULT '',
  live_demo       TEXT        DEFAULT '',
  category        TEXT        DEFAULT 'General',
  status          TEXT        DEFAULT 'completed'
                              CHECK (status IN ('completed','in-progress','planned')),
  completion_date TEXT        DEFAULT '',
  sort_order      INTEGER     DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Skill Categories ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skill_categories (
  id          UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  title       TEXT        NOT NULL,
  icon        TEXT        DEFAULT 'fas fa-code',
  bg          TEXT        DEFAULT 'bg-blue-100',
  title_color TEXT        DEFAULT 'text-blue-800',
  sort_order  INTEGER     DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Skills ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
  id          UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID        REFERENCES skill_categories(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  icon        TEXT        DEFAULT 'fas fa-code',
  color       TEXT        DEFAULT 'text-gray-600',
  hover_bg    TEXT        DEFAULT 'hover:bg-gray-100',
  sort_order  INTEGER     DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security ───────────────────────────────────────
ALTER TABLE projects         ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills           ENABLE ROW LEVEL SECURITY;

-- Public can read everything
CREATE POLICY "public_read_projects"    ON projects         FOR SELECT USING (true);
CREATE POLICY "public_read_categories"  ON skill_categories FOR SELECT USING (true);
CREATE POLICY "public_read_skills"      ON skills           FOR SELECT USING (true);

-- Only authenticated users (admin) can write
CREATE POLICY "auth_insert_projects"    ON projects         FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_projects"    ON projects         FOR UPDATE USING    (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_projects"    ON projects         FOR DELETE USING    (auth.role() = 'authenticated');

CREATE POLICY "auth_insert_categories"  ON skill_categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_categories"  ON skill_categories FOR UPDATE USING    (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_categories"  ON skill_categories FOR DELETE USING    (auth.role() = 'authenticated');

CREATE POLICY "auth_insert_skills"      ON skills           FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_skills"      ON skills           FOR UPDATE USING    (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_skills"      ON skills           FOR DELETE USING    (auth.role() = 'authenticated');

-- ── Auto-update updated_at ───────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Seed: Projects ───────────────────────────────────────────
INSERT INTO projects (title, description, technologies, image, live_demo, category, status, sort_order)
VALUES
  (
    'Visit Rwanda',
    'The project aims to showcase Rwanda as a top travel destination, highlighting its stunning landscapes, diverse wildlife, rich culture, and investment opportunities.',
    ARRAY['HTML5','CSS3','JavaScript'],
    '/images/rwanda.webp',
    'https://bethereforthem.github.io/Visit-Rwanda/',
    'Web', 'completed', 1
  ),
  (
    'Currency Converter',
    'A web-based app that converts from any currency to USD and vice versa using live exchange rates. Built with Tailwind CSS and Font Awesome for a clean, responsive UI.',
    ARRAY['HTML5','Tailwind CSS','JavaScript','Exchange Rate API'],
    '/images/currency.jpg',
    'https://bethereforthem.github.io/Currency-converter/',
    'Web', 'completed', 2
  ),
  (
    'To-Do List Pro',
    'A sleek and intuitive to-do list web app that helps users manage tasks, customize reset intervals, and stay productive every day.',
    ARRAY['HTML5','CSS3','JavaScript'],
    '/images/to_do.webp',
    'https://bethereforthem.github.io/To-Do-LIst/',
    'Web', 'completed', 3
  );

-- ── Seed: Skill Categories & Skills ─────────────────────────
WITH frontend AS (
  INSERT INTO skill_categories (title, icon, bg, title_color, sort_order)
  VALUES ('Frontend Development','fas fa-laptop-code','bg-blue-100','text-blue-800',1)
  RETURNING id
)
INSERT INTO skills (category_id, name, icon, color, hover_bg, sort_order)
SELECT frontend.id, s.name, s.icon, s.color, s.hover_bg, s.sort_order
FROM frontend, (VALUES
  ('HTML5',              'fab fa-html5',       'text-orange-500', 'hover:bg-orange-100', 1),
  ('CSS3',               'fab fa-css3-alt',    'text-blue-500',   'hover:bg-blue-100',   2),
  ('JavaScript',         'fab fa-js-square',   'text-yellow-400', 'hover:bg-yellow-100', 3),
  ('React.js',           'fab fa-react',       'text-cyan-400',   'hover:bg-cyan-100',   4),
  ('Flutter (Dart)',     'fas fa-mobile-alt',  'text-blue-500',   'hover:bg-blue-100',   5),
  ('Responsive Design',  'fas fa-mobile-alt',  'text-pink-400',   'hover:bg-pink-100',   6),
  ('Bootstrap',          'fab fa-bootstrap',   'text-purple-600', 'hover:bg-purple-100', 7),
  ('Tailwind CSS',       'fas fa-palette',     'text-indigo-400', 'hover:bg-indigo-100', 8)
) AS s(name, icon, color, hover_bg, sort_order);

WITH backend AS (
  INSERT INTO skill_categories (title, icon, bg, title_color, sort_order)
  VALUES ('Backend Development','fas fa-server','bg-green-100','text-green-800',2)
  RETURNING id
)
INSERT INTO skills (category_id, name, icon, color, hover_bg, sort_order)
SELECT backend.id, s.name, s.icon, s.color, s.hover_bg, s.sort_order
FROM backend, (VALUES
  ('Node.js',    'fab fa-node-js', 'text-green-600', 'hover:bg-green-100',  1),
  ('Express.js', 'fas fa-leaf',    'text-green-700', 'hover:bg-green-200',  2),
  ('Django',     'fab fa-python',  'text-blue-400',  'hover:bg-blue-100',   3)
) AS s(name, icon, color, hover_bg, sort_order);

WITH databases AS (
  INSERT INTO skill_categories (title, icon, bg, title_color, sort_order)
  VALUES ('Databases','fas fa-database','bg-purple-100','text-purple-800',3)
  RETURNING id
)
INSERT INTO skills (category_id, name, icon, color, hover_bg, sort_order)
SELECT databases.id, s.name, s.icon, s.color, s.hover_bg, s.sort_order
FROM databases, (VALUES
  ('MySQL',      'fas fa-database', 'text-blue-800',   'hover:bg-blue-100',   1),
  ('MongoDB',    'fas fa-database', 'text-green-500',  'hover:bg-green-100',  2),
  ('PostgreSQL', 'fas fa-database', 'text-indigo-500', 'hover:bg-indigo-100', 3),
  ('Redis',      'fas fa-database', 'text-red-500',    'hover:bg-red-100',    4)
) AS s(name, icon, color, hover_bg, sort_order);

WITH devops AS (
  INSERT INTO skill_categories (title, icon, bg, title_color, sort_order)
  VALUES ('DevOps','fas fa-tools','bg-yellow-100','text-yellow-800',4)
  RETURNING id
)
INSERT INTO skills (category_id, name, icon, color, hover_bg, sort_order)
SELECT devops.id, s.name, s.icon, s.color, s.hover_bg, s.sort_order
FROM devops, (VALUES
  ('Docker', 'fab fa-docker',          'text-blue-600', 'hover:bg-blue-100',  1),
  ('AWS',    'fab fa-aws',             'text-orange-400','hover:bg-orange-100',2),
  ('CI/CD',  'fas fa-cloud-upload-alt','text-cyan-600', 'hover:bg-cyan-100',  3),
  ('Nginx',  'fas fa-server',          'text-gray-600', 'hover:bg-gray-100',  4)
) AS s(name, icon, color, hover_bg, sort_order);

WITH tools AS (
  INSERT INTO skill_categories (title, icon, bg, title_color, sort_order)
  VALUES ('Tools & Technologies','fas fa-tools','bg-pink-100','text-pink-800',5)
  RETURNING id
)
INSERT INTO skills (category_id, name, icon, color, hover_bg, sort_order)
SELECT tools.id, s.name, s.icon, s.color, s.hover_bg, s.sort_order
FROM tools, (VALUES
  ('Git',    'fab fa-git-alt',    'text-red-500',    'hover:bg-red-100',  1),
  ('GitHub', 'fab fa-github',     'text-gray-800',   'hover:bg-gray-200', 2),
  ('GitLab', 'fas fa-code-branch','text-orange-600', 'hover:bg-orange-100',3),
  ('Figma',  'fab fa-figma',      'text-purple-600', 'hover:bg-purple-100',4),
  ('CLI',    'fas fa-terminal',   'text-gray-800',   'hover:bg-gray-100', 5),
  ('npm',    'fab fa-npm',        'text-red-600',    'hover:bg-red-200',  6)
) AS s(name, icon, color, hover_bg, sort_order);
