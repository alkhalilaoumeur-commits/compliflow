-- CompliFlow — Supabase Waitlist Schema
-- Ausführen im Supabase SQL-Editor: https://supabase.com/dashboard/project/_/sql
-- Einmalig beim ersten Aufsetzen ausführen.

-- Tabelle erstellen
CREATE TABLE IF NOT EXISTS waitlist (
  id          bigserial PRIMARY KEY,
  email       text NOT NULL,
  source      text NOT NULL DEFAULT 'coming-soon',
  confirmed   boolean NOT NULL DEFAULT false,
  confirmed_at timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT waitlist_email_unique UNIQUE (email)
);

-- Kommentar für Klarheit
COMMENT ON TABLE waitlist IS 'Double-Opt-In Warteliste. Nur confirmed=true Einträge für Marketing verwenden.';
COMMENT ON COLUMN waitlist.confirmed IS 'true = DOI-Link wurde angeklickt. false = nur angemeldet, noch nicht bestätigt.';

-- Row-Level Security aktivieren
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Policy: Anon darf INSERT (für DOI-Confirm-Route mit Anon-Key)
-- Kein SELECT, kein UPDATE, kein DELETE für anon → Daten geschützt
CREATE POLICY "anon_can_insert_waitlist"
  ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Anon darf UPDATE (für merge-duplicates / ON CONFLICT DO UPDATE)
-- Notwendig damit Supabase UPSERT confirmed=true setzen kann wenn Email schon existiert
-- USING(true) = anon kann jede Zeile finden zum Update (kein SELECT-Recht, nur für UPSERT-Mechanismus)
CREATE POLICY "anon_can_update_waitlist"
  ON waitlist
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (
    -- Anon darf NUR confirmed=true setzen, nie false (kein Downgrade)
    confirmed = true
  );

-- Policy: Nur authenticated (Service-Role via Supabase Dashboard) darf lesen
CREATE POLICY "auth_can_read_waitlist"
  ON waitlist
  FOR SELECT
  TO authenticated
  USING (true);

-- Index für schnelle Email-Suche
CREATE INDEX IF NOT EXISTS waitlist_email_idx ON waitlist (email);
CREATE INDEX IF NOT EXISTS waitlist_confirmed_idx ON waitlist (confirmed) WHERE confirmed = true;

-- Hinweis: Nach diesem Script im Supabase Dashboard prüfen:
-- 1. Table Editor: waitlist Tabelle sichtbar
-- 2. Authentication → Policies: 3 Policies für waitlist
-- 3. ENV-Variablen in Coolify setzen:
--    NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
--    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
--    DOI_SECRET=<openssl rand -hex 32>
