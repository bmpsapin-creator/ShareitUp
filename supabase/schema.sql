-- Aluga.pt SaaS — Schema Completo
-- Executa este SQL no Supabase → SQL Editor

-- ── TABELAS ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS companies (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT,
  phone       TEXT,
  slug        TEXT UNIQUE NOT NULL,
  owner_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id    UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  category      TEXT DEFAULT 'Outros',
  price_per_day DECIMAL(10,2) NOT NULL DEFAULT 0,
  description   TEXT,
  emoji         TEXT DEFAULT '📦',
  available     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  email       TEXT,
  phone       TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reservations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  client_id   UUID REFERENCES clients(id) ON DELETE SET NULL,
  item_id     UUID REFERENCES items(id) ON DELETE SET NULL,
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  status      TEXT DEFAULT 'pending'
              CHECK (status IN ('pending','active','done','cancelled')),
  notes       TEXT,
  total       DECIMAL(10,2),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── RLS — Row Level Security ──────────────────────────────
-- Cada empresa só vê os seus próprios dados

ALTER TABLE companies   ENABLE ROW LEVEL SECURITY;
ALTER TABLE items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients     ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Companies: owner vê e gere a sua empresa
CREATE POLICY "owner_all" ON companies
  FOR ALL USING (auth.uid() = owner_id);

-- Items: acesso via empresa do utilizador autenticado
CREATE POLICY "company_items" ON items
  FOR ALL USING (
    company_id IN (
      SELECT id FROM companies WHERE owner_id = auth.uid()
    )
  );

-- Clients: acesso via empresa do utilizador autenticado
CREATE POLICY "company_clients" ON clients
  FOR ALL USING (
    company_id IN (
      SELECT id FROM companies WHERE owner_id = auth.uid()
    )
  );

-- Reservations: acesso via empresa do utilizador autenticado
CREATE POLICY "company_reservations" ON reservations
  FOR ALL USING (
    company_id IN (
      SELECT id FROM companies WHERE owner_id = auth.uid()
    )
  );

-- Catálogo público: qualquer pessoa pode ver itens disponíveis
CREATE POLICY "public_catalog" ON items
  FOR SELECT USING (available = TRUE);

CREATE POLICY "public_company" ON companies
  FOR SELECT USING (TRUE);

-- ── ÍNDICES (performance) ─────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_items_company        ON items(company_id);
CREATE INDEX IF NOT EXISTS idx_clients_company      ON clients(company_id);
CREATE INDEX IF NOT EXISTS idx_reservations_company ON reservations(company_id);
CREATE INDEX IF NOT EXISTS idx_companies_slug        ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_owner       ON companies(owner_id);
