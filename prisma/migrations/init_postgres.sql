-- Cloaker Hub — Schema inicial PostgreSQL
-- Execute este arquivo no seu banco PostgreSQL no EasyPanel

CREATE TABLE IF NOT EXISTS "User" (
  "id"        TEXT NOT NULL PRIMARY KEY,
  "fullName"  TEXT NOT NULL,
  "username"  TEXT NOT NULL UNIQUE,
  "email"     TEXT NOT NULL UNIQUE,
  "phone"     TEXT,
  "password"  TEXT NOT NULL,
  "plan"      TEXT NOT NULL DEFAULT 'starter',
  "apiKey"    TEXT UNIQUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Campaign" (
  "id"             TEXT NOT NULL PRIMARY KEY,
  "userId"         TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "name"           TEXT NOT NULL,
  "slug"           TEXT NOT NULL UNIQUE,
  "prismaId"       TEXT NOT NULL UNIQUE,
  "status"         TEXT NOT NULL DEFAULT 'active',
  "safeUrl"        TEXT NOT NULL,
  "moneyUrl"       TEXT NOT NULL,
  "trafficSource"  TEXT NOT NULL DEFAULT 'facebook',
  "riskScore"      INTEGER NOT NULL DEFAULT 75,
  "countries"      TEXT NOT NULL DEFAULT '[]',
  "languages"      TEXT NOT NULL DEFAULT '[]',
  "advancedConfig" TEXT NOT NULL DEFAULT '{}',
  "visitors"       INTEGER NOT NULL DEFAULT 0,
  "blockedCount"   INTEGER NOT NULL DEFAULT 0,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "Campaign_userId_idx" ON "Campaign"("userId");
CREATE INDEX IF NOT EXISTS "Campaign_slug_idx" ON "Campaign"("slug");

CREATE TABLE IF NOT EXISTS "TrafficLog" (
  "id"         TEXT NOT NULL PRIMARY KEY,
  "campaignId" TEXT NOT NULL REFERENCES "Campaign"("id") ON DELETE CASCADE,
  "ip"         TEXT NOT NULL,
  "country"    TEXT,
  "device"     TEXT,
  "platform"   TEXT,
  "status"     TEXT NOT NULL,
  "reason"     TEXT,
  "score"      INTEGER NOT NULL DEFAULT 0,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "TrafficLog_campaignId_createdAt_idx" ON "TrafficLog"("campaignId", "createdAt");
CREATE INDEX IF NOT EXISTS "TrafficLog_status_createdAt_idx" ON "TrafficLog"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "TrafficLog_score_createdAt_idx" ON "TrafficLog"("score", "createdAt");

CREATE TABLE IF NOT EXISTS "Domain" (
  "id"        TEXT NOT NULL PRIMARY KEY,
  "userId"    TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "url"       TEXT NOT NULL UNIQUE,
  "isActive"  BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "Domain_userId_idx" ON "Domain"("userId");

CREATE TABLE IF NOT EXISTS "BehavioralLog" (
  "id"             TEXT NOT NULL PRIMARY KEY,
  "campaignId"     TEXT NOT NULL,
  "fingerprint"    TEXT NOT NULL,
  "isBot"          BOOLEAN NOT NULL DEFAULT false,
  "cpuCores"       INTEGER,
  "deviceMemory"   INTEGER,
  "platform"       TEXT,
  "languages"      TEXT,
  "screenRes"      TEXT,
  "hasWebdriver"   BOOLEAN NOT NULL DEFAULT false,
  "mouseMovements" INTEGER NOT NULL DEFAULT 0,
  "clicks"         INTEGER NOT NULL DEFAULT 0,
  "scrollDepth"    INTEGER NOT NULL DEFAULT 0,
  "timeOnPage"     INTEGER NOT NULL DEFAULT 0,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "BehavioralLog_campaignId_createdAt_idx" ON "BehavioralLog"("campaignId", "createdAt");
