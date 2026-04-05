-- Grok-Cloaker: Schema inicial para PostgreSQL
-- Gerado para uso com EasyPanel + Prisma
-- Execute este arquivo no painel SQL do seu banco no EasyPanel

-- Tabela de Usuários (Auth)
CREATE TABLE IF NOT EXISTS "User" (
    "id"        TEXT PRIMARY KEY,
    "fullName"  TEXT NOT NULL,
    "username"  TEXT NOT NULL UNIQUE,
    "email"     TEXT NOT NULL UNIQUE,
    "phone"     TEXT,
    "password"  TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Campanhas
CREATE TABLE IF NOT EXISTS "Campaign" (
    "id"             TEXT PRIMARY KEY,
    "slug"           TEXT NOT NULL UNIQUE,
    "userId"         TEXT,
    "name"           TEXT NOT NULL,
    "status"         TEXT NOT NULL DEFAULT 'active',
    "safeUrl"        TEXT NOT NULL,
    "moneyUrl"       TEXT NOT NULL,
    "trafficSource"  TEXT NOT NULL DEFAULT 'facebook',
    "prismaId"       TEXT NOT NULL UNIQUE,
    "filterBrowser"  BOOLEAN NOT NULL DEFAULT TRUE,
    "countries"      TEXT NOT NULL DEFAULT '[]',
    "languages"      TEXT NOT NULL DEFAULT '[]',
    "advancedConfig" TEXT NOT NULL DEFAULT '{}',
    "riskScore"      INTEGER NOT NULL DEFAULT 75,
    "visitors"       INTEGER NOT NULL DEFAULT 0,
    "blockedCount"   INTEGER NOT NULL DEFAULT 0,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Campaign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabela de Domínios
CREATE TABLE IF NOT EXISTS "Domain" (
    "id"        TEXT PRIMARY KEY,
    "url"       TEXT NOT NULL UNIQUE,
    "isActive"  BOOLEAN NOT NULL DEFAULT TRUE,
    "sslActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Logs de Tráfego
CREATE TABLE IF NOT EXISTS "TrafficLog" (
    "id"         TEXT PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "ip"         TEXT NOT NULL,
    "country"    TEXT,
    "device"     TEXT,
    "platform"   TEXT,
    "status"     TEXT NOT NULL,
    "reason"     TEXT,
    "score"      INTEGER NOT NULL DEFAULT 0,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TrafficLog_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Índices para performance nas queries mais críticas
CREATE INDEX IF NOT EXISTS "Campaign_slug_idx" ON "Campaign"("slug");
CREATE INDEX IF NOT EXISTS "Campaign_status_idx" ON "Campaign"("status");
CREATE INDEX IF NOT EXISTS "TrafficLog_campaignId_idx" ON "TrafficLog"("campaignId");
CREATE INDEX IF NOT EXISTS "TrafficLog_createdAt_idx" ON "TrafficLog"("createdAt");
CREATE INDEX IF NOT EXISTS "TrafficLog_status_idx" ON "TrafficLog"("status");

-- Função para atualizar updatedAt automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW."updatedAt" = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_campaign_updated_at
    BEFORE UPDATE ON "Campaign"
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
