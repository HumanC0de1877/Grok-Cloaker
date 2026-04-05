# Design Técnico — Cloaker Ads Platform

## Overview

A plataforma é um sistema de cloaking de tráfego pago multi-plataforma (Facebook Ads, TikTok Ads, Google Ads, Kwai Ads) que avalia cada visitante em tempo real e decide entre redirecionar para a Money Page (visitante legítimo) ou Safe Page (bot, moderador, tráfego suspeito).

A stack é Next.js 15 App Router com Prisma ORM e PostgreSQL hospedado no EasyPanel, deployado no Cloudflare Pages. O motor de cloaking roda como Route Handler do Next.js na borda (Edge Runtime via Cloudflare Workers).

### Decisões de Design Principais

- **Route Handler `/{slug}` como ponto de entrada público**: toda avaliação de risco ocorre em um único handler, sem autenticação de usuário, apenas validação do `prismaid`.
- **Score acumulativo**: cada módulo de detecção incrementa um score; a decisão final é threshold-based, tornando o sistema configurável por campanha.
- **JWT em cookie HttpOnly**: autenticação stateless sem necessidade de session store.
- **Prisma com PostgreSQL**: schema tipado, migrations versionadas, sem SQLite em nenhum ambiente.
- **Zod em todos os endpoints de escrita**: validação de entrada centralizada e tipada.

---

## Architecture

```mermaid
graph TB
    subgraph "Cloudflare Edge"
        SLUG["Route Handler /{slug}\n(Motor de Cloaking)"]
        API["API Routes /api/*\n(Autenticado via JWT)"]
        TRACKER_JS["GET /tracker.js\n(Script público)"]
    end

    subgraph "Next.js App Router"
        AUTH["(auth) — Login / Register"]
        DASHBOARD["(dashboard) — Painel"]
        MW["middleware.ts\n(JWT Guard)"]
    end

    subgraph "Data Layer"
        PRISMA["Prisma ORM"]
        PG["PostgreSQL\n(EasyPanel)"]
    end

    subgraph "Plataformas de Anúncios"
        FB["Facebook Ads"]
        TT["TikTok Ads"]
        GG["Google Ads"]
        KW["Kwai Ads"]
    end

    FB & TT & GG & KW -->|"/{slug}?prismaid=XXX"| SLUG
    SLUG -->|"score >= threshold"| SAFE["Safe Page"]
    SLUG -->|"score < threshold"| MONEY["Money Page"]
    MONEY -->|"<script src='/tracker.js'>"| TRACKER_JS
    TRACKER_JS -->|"POST /api/analytics"| API

    AUTH --> API
    DASHBOARD --> API
    MW -->|"valida JWT"| API
    API --> PRISMA
    SLUG --> PRISMA
    PRISMA --> PG
```

### Fluxo de Avaliação de Risco

```mermaid
sequenceDiagram
    participant Visitor
    participant CloakEngine as Motor de Cloaking /{slug}
    participant DB as PostgreSQL

    Visitor->>CloakEngine: GET /{slug}?prismaid=XXX
    CloakEngine->>DB: findUnique({ where: { slug } })
    DB-->>CloakEngine: Campaign | null

    alt Campanha não encontrada
        CloakEngine-->>Visitor: 302 → google.com
    else Campanha pausada
        CloakEngine-->>Visitor: 302 → safeUrl
    else Campanha ativa
        CloakEngine->>CloakEngine: Avaliar módulos (score acumulativo)
        Note over CloakEngine: PrismaID, Bot UA, Network UA,<br/>AdSpy, Geo, Lang, Device, ASN
        CloakEngine->>DB: trafficLog.create(...)
        CloakEngine->>DB: campaign.update({ visitors++, blockedCount++ })

        alt score >= riskScore
            CloakEngine-->>Visitor: 302 → safeUrl
        else score < riskScore
            CloakEngine-->>Visitor: 302 → moneyUrl
        end
    end
```

---

## Components and Interfaces

### 1. Motor de Cloaking — `app/[slug]/route.ts`

Único ponto de entrada público de redirecionamento. Sem autenticação de usuário.

```typescript
// Interface interna do motor
interface CloakEvaluation {
  isBlocked: boolean
  score: number
  reason: string
  destination: string
}

interface CloakContext {
  ip: string
  country: string        // cf-ipcountry
  userAgent: string
  acceptLanguage: string
  referrer: string
  cfAsn: string          // cf-ipasn
  prismaid: string | null
}

function evaluateCloaking(campaign: Campaign, ctx: CloakContext): CloakEvaluation
```

**Módulos de detecção** (cada um retorna incremento de score):

| Módulo | Trigger | Score |
|--------|---------|-------|
| PrismaID | prismaid ausente ou incorreto | +100 |
| Bot UA | strings de bot no user-agent | +80 |
| Network UA | crawlers de plataformas de anúncios | +100 |
| AdSpy | referrer de ferramentas de espionagem | +100 |
| Geo | país fora da whitelist / na blacklist | +50 |
| Language | idioma do browser não permitido | +30 |
| Device | tipo de dispositivo não permitido | +30 |
| ASN | ASN de datacenter conhecido | +80 |

### 2. Autenticador — `app/api/auth/`

```typescript
// POST /api/auth/register
interface RegisterInput {
  fullName: string       // min 2 chars
  username: string       // /^[a-zA-Z0-9_]+$/, min 3
  email: string          // formato válido
  phone?: string
  password: string       // min 8, 1 maiúscula, 1 minúscula, 1 número
  confirmPassword: string
}

// POST /api/auth/login
interface LoginInput {
  email: string
  password: string
}

// Resposta de login — seta cookie HttpOnly
interface LoginResponse {
  user: { id: string; fullName: string; email: string; plan: string }
}
// Cookie: token=<JWT>; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

### 3. Gerenciador de Campanhas — `app/api/campaigns/`

```typescript
// POST /api/campaigns
interface CreateCampaignInput {
  name: string
  safeUrl: string        // URL válida
  moneyUrl: string       // URL válida
  trafficSource: 'facebook' | 'tiktok' | 'google' | 'kwai'
  riskScore?: number     // 0-100, default 75
  countries?: string[]   // ISO 3166-1 alpha-2
  languages?: string[]   // ex: ['pt-BR', 'pt']
  devices?: { mobile: boolean; desktop: boolean }
  advancedConfig?: AdvancedConfig
}

interface AdvancedConfig {
  bots?: boolean
  networks?: boolean
  adSpy?: boolean
  proxyVpn?: boolean
  geo?: { whitelist?: string[]; blacklist?: string[] }
  langs?: string[]
  devices?: { mobile?: boolean; desktop?: boolean }
}

// Geração automática (não aceita do cliente)
// slug: 6 chars [A-Z0-9], único
// prismaId: 12 chars [A-Z0-9], único
```

### 4. Motor de Analytics — `app/api/analytics/`

```typescript
// GET /api/analytics?campaignId=&period=24h|7d|30d
interface AnalyticsResponse {
  summary: {
    totalVisitors: number
    totalBlocked: number
    blockRate: number      // percentual
  }
  byCountry: { country: string; count: number }[]
  byDevice: { device: string; count: number }[]
  bySource: { source: string; count: number }[]
  timeSeries: { hour: string; visitors: number; blocked: number }[]
}

// GET /api/analytics/live
interface LiveMetrics {
  last5min: { total: number; blocked: number }
  topBlockReasons: { reason: string; count: number }[]
}

// GET /api/analytics/logs?page=&status=&campaignId=&country=&from=&to=
interface LogsResponse {
  logs: TrafficLog[]
  total: number
  page: number
  pageSize: 50
}

// GET /api/analytics/export?...
// Content-Type: text/csv
```

### 5. Tracker — `public/tracker.js`

Script vanilla JS injetado na Money Page. Sem dependências externas.

```typescript
// Dados coletados
interface TrackerPayload {
  campaignId: string        // utm_campaign da URL
  fingerprint: string       // hash canvas
  cpuCores: number
  deviceMemory: number
  platform: string
  languages: string[]
  screenResolution: string
  hasWebdriver: boolean
  hasChrome: boolean
  isBot: boolean
  mouseMovements: number
  clicks: number
  scrollDepth: number       // 0-100%
  timeOnPage: number        // segundos
}
```

### 6. Gerenciador de Domínios — `app/api/domains/`

```typescript
// POST /api/domains
interface AddDomainInput {
  url: string   // domínio sem protocolo, ex: "meusite.com"
}

// POST /api/domains/:id/verify
// Realiza lookup DNS CNAME e atualiza isActive

// Instruções DNS retornadas:
interface DnsInstructions {
  type: 'CNAME'
  name: '@'
  value: string   // process.env.CNAME_TARGET
}
```

### 7. Middleware JWT — `middleware.ts`

```typescript
// Protege todas as rotas /api/* exceto:
// - /api/auth/*
// - /api/analytics (POST — recebe dados do tracker)
// - /{slug} (não é /api/)

// Extrai JWT do cookie 'token'
// Verifica assinatura com JWT_SECRET
// Injeta userId no header X-User-Id para os handlers
```

---

## Data Models

### Schema Prisma (PostgreSQL)

```prisma
model User {
  id        String     @id @default(cuid())
  fullName  String
  username  String     @unique
  email     String     @unique
  phone     String?
  password  String     // bcrypt hash, custo >= 12
  plan      String     @default("starter") // starter | pro | black
  apiKey    String?    @unique             // apenas plano black
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  campaigns Campaign[]
  domains   Domain[]
}

model Campaign {
  id             String       @id @default(cuid())
  userId         String
  user           User         @relation(fields: [userId], references: [id])
  name           String
  slug           String       @unique  // 6 chars [A-Z0-9]
  prismaId       String       @unique  // 12 chars [A-Z0-9]
  status         String       @default("active")  // active | paused
  safeUrl        String
  moneyUrl       String
  trafficSource  String       @default("facebook")
  riskScore      Int          @default(75)
  countries      String       @default("[]")  // JSON array ISO codes
  languages      String       @default("[]")  // JSON array
  advancedConfig String       @default("{}") @db.Text
  visitors       Int          @default(0)
  blockedCount   Int          @default(0)
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
  logs           TrafficLog[]
}

model TrafficLog {
  id         String   @id @default(cuid())
  campaignId String
  campaign   Campaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  ip         String
  country    String?
  device     String?  // Mobile | Desktop
  platform   String?  // facebook | tiktok | google | kwai
  status     String   // allowed | blocked
  reason     String?
  score      Int      @default(0)
  createdAt  DateTime @default(now())

  @@index([campaignId, createdAt])
  @@index([status, createdAt])
  @@index([score, createdAt])
}

model Domain {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  url       String   @unique
  isActive  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model BehavioralLog {
  id             String   @id @default(cuid())
  campaignId     String
  fingerprint    String
  isBot          Boolean  @default(false)
  cpuCores       Int?
  deviceMemory   Int?
  platform       String?
  languages      String?  // JSON array
  screenRes      String?
  hasWebdriver   Boolean  @default(false)
  mouseMovements Int      @default(0)
  clicks         Int      @default(0)
  scrollDepth    Int      @default(0)
  timeOnPage     Int      @default(0)
  createdAt      DateTime @default(now())

  @@index([campaignId, createdAt])
}
```

### Variáveis de Ambiente Obrigatórias

```env
# .env.example
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=<string aleatória >= 32 chars>
NEXTAUTH_SECRET=<string aleatória >= 32 chars>
CNAME_TARGET=pages.cloaker.app
ALLOWED_ORIGINS=https://app.cloaker.com
```

---

## Correctness Properties

*Uma propriedade é uma característica ou comportamento que deve ser verdadeiro em todas as execuções válidas de um sistema — essencialmente, uma declaração formal sobre o que o sistema deve fazer. Propriedades servem como ponte entre especificações legíveis por humanos e garantias de corretude verificáveis por máquina.*

### Property 1: Hash de senha com bcrypt custo >= 12

*Para qualquer* conjunto válido de dados de registro, a senha armazenada no banco deve ser um hash bcrypt com custo mínimo 12, e `bcrypt.compare(senhaOriginal, hash)` deve retornar `true`.

**Validates: Requirements 2.1**

---

### Property 2: Unicidade de e-mail e username no registro

*Para qualquer* usuário já registrado no sistema, tentar registrar outro usuário com o mesmo e-mail ou o mesmo username deve retornar HTTP 409.

**Validates: Requirements 2.2**

---

### Property 3: JWT válido em cookie com flags de segurança

*Para qualquer* usuário registrado com credenciais válidas, o login deve retornar um cookie `token` com as flags `HttpOnly`, `Secure` e `SameSite=Strict`, contendo um JWT decodificável com o `JWT_SECRET` correto.

**Validates: Requirements 2.3**

---

### Property 4: Rejeição de senha incorreta no login

*Para qualquer* usuário registrado, tentar fazer login com qualquer senha diferente da senha cadastrada deve retornar HTTP 401, sem revelar qual campo está incorreto.

**Validates: Requirements 2.4**

---

### Property 5: Validação de formato de e-mail e senha

*Para qualquer* string que não seja um e-mail válido (RFC 5322), ou qualquer senha que não contenha ao menos 8 caracteres com 1 maiúscula, 1 minúscula e 1 número, o registro deve ser rejeitado com HTTP 400.

**Validates: Requirements 2.8**

---

### Property 6: Isolamento de campanhas por usuário

*Para qualquer* dois usuários distintos A e B, a listagem de campanhas do usuário A nunca deve conter campanhas criadas pelo usuário B, e vice-versa.

**Validates: Requirements 3.5, 3.6, 3.7**

---

### Property 7: Geração de slug e prismaId únicos e no formato correto

*Para qualquer* conjunto de N campanhas criadas, todos os slugs devem ter exatamente 6 caracteres do conjunto `[A-Z0-9]`, todos os prismaIds devem ter exatamente 12 caracteres do conjunto `[A-Z0-9]`, e nenhum slug ou prismaId deve se repetir entre as campanhas.

**Validates: Requirements 3.2, 3.3**

---

### Property 8: Exclusão em cascata de logs ao deletar campanha

*Para qualquer* campanha com N TrafficLogs associados, após a exclusão da campanha, nenhum dos N logs deve existir no banco de dados.

**Validates: Requirements 3.8**

---

### Property 9: Limite de campanhas por plano Starter

*Para qualquer* usuário com plano `starter` que já possui 3 campanhas ativas, tentar criar uma nova campanha deve retornar HTTP 403, independentemente dos dados da nova campanha.

**Validates: Requirements 8.2**

---

### Property 10: Decisão de redirecionamento baseada em score

*Para qualquer* campanha ativa com threshold T e qualquer conjunto de sinais de detecção que resultem em score acumulado S:
- Se S >= T, o motor deve redirecionar para `safeUrl` com HTTP 302.
- Se S < T, o motor deve redirecionar para `moneyUrl` com HTTP 302.

**Validates: Requirements 4.12, 4.13**

---

### Property 11: Incremento correto de score por módulo de detecção

*Para qualquer* requisição ao motor de cloaking, cada módulo de detecção ativado deve incrementar o score pelo valor exato especificado (PrismaID inválido: +100, Bot UA: +80, Network UA: +100, AdSpy: +100, Geo: +50, Language: +30, Device: +30, ASN: +80), e o score final deve ser a soma dos módulos ativados.

**Validates: Requirements 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 4.11**

---

### Property 12: Registro de TrafficLog para cada requisição avaliada

*Para qualquer* requisição ao motor de cloaking (campanha existente ou não), um `TrafficLog` deve ser criado com os campos `campaignId`, `ip`, `country`, `device`, `status` e `score` preenchidos corretamente.

**Validates: Requirements 4.14**

---

### Property 13: Isolamento de métricas de analytics por usuário

*Para qualquer* dois usuários distintos A e B com campanhas e logs distintos, as métricas retornadas para o usuário A devem ser calculadas exclusivamente a partir dos logs das campanhas do usuário A.

**Validates: Requirements 6.1**

---

### Property 14: Filtragem temporal correta de logs

*Para qualquer* conjunto de logs com timestamps variados e qualquer período de filtro (24h, 7d, 30d), o resultado deve conter apenas logs cujo `createdAt` está dentro do intervalo `[now - período, now]`.

**Validates: Requirements 6.3, 6.6**

---

### Property 15: Paginação de logs com 50 itens por página em ordem decrescente

*Para qualquer* conjunto de N > 50 logs de um usuário, a primeira página deve conter exatamente 50 logs ordenados por `createdAt` decrescente, e o log mais recente deve ser o primeiro item.

**Validates: Requirements 6.5**

---

### Property 16: Detecção de bot pelo Tracker

*Para qualquer* ambiente de navegador onde `navigator.webdriver === true` ou `window.chrome` está ausente, o Tracker deve definir `isBot = true` no payload enviado para `/api/analytics`.

**Validates: Requirements 5.3**

---

### Property 17: Extração de campaignId do utm_campaign

*Para qualquer* URL contendo o parâmetro `utm_campaign=X`, o Tracker deve extrair e usar `X` como `campaignId` no payload enviado para `/api/analytics`.

**Validates: Requirements 5.6**

---

### Property 18: Proteção de rotas com JWT

*Para qualquer* rota `/api/*` protegida (exceto `/api/auth/*` e `POST /api/analytics`), qualquer requisição sem um JWT válido no cookie `token` deve retornar HTTP 401.

**Validates: Requirements 11.1, 11.2**

---

### Property 19: Validação Zod retorna 400 com campos inválidos

*Para qualquer* payload enviado a um endpoint de escrita que viole o schema Zod correspondente, a resposta deve ser HTTP 400 contendo a lista dos campos inválidos.

**Validates: Requirements 11.3, 11.4**

---

### Property 20: Headers de segurança em todas as respostas

*Para qualquer* endpoint da API, a resposta deve conter os headers `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` e `Referrer-Policy: no-referrer`.

**Validates: Requirements 11.5**

---

## Error Handling

### Estratégia Geral

| Camada | Erro | Comportamento |
|--------|------|---------------|
| Motor de Cloaking | Qualquer exceção | 302 → `https://google.com` (fail-open, sem expor detalhes) |
| API Routes | Erro de validação Zod | 400 + lista de campos inválidos |
| API Routes | JWT ausente/inválido | 401 |
| API Routes | Recurso de outro usuário | 403 |
| API Routes | Recurso não encontrado | 404 |
| API Routes | Erro interno | 500 + mensagem genérica (sem stack trace) |
| Inicialização | Variável de ambiente ausente | Processo encerra com mensagem descritiva |

### Validação de Variáveis de Ambiente

```typescript
// lib/env.ts — executado na inicialização
const REQUIRED_ENV = ['DATABASE_URL', 'JWT_SECRET', 'NEXTAUTH_SECRET'] as const

for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`[FATAL] Variável de ambiente obrigatória ausente: ${key}`)
    process.exit(1)
  }
}
```

### Tratamento de Erros no Motor de Cloaking

O motor usa `try/catch` global e em caso de qualquer erro (banco indisponível, timeout, etc.) redireciona para `https://google.com` sem logar detalhes na resposta. Erros são logados apenas no servidor (console.error).

### Rate Limiting no Login

Implementado via contador em memória (ou Redis se disponível) por IP. Após 10 tentativas em 60 segundos, retorna HTTP 429 com header `Retry-After: 60`.

---

## Testing Strategy

### Abordagem Dual

O projeto usa dois tipos complementares de teste:

1. **Testes de Propriedade (Property-Based Testing)** — validam propriedades universais com inputs gerados aleatoriamente (mínimo 100 iterações cada).
2. **Testes de Exemplo (Unit/Integration)** — validam comportamentos específicos, casos de borda e integrações.

### Biblioteca de PBT

**fast-check** (TypeScript/JavaScript) — escolhida por integração nativa com Jest/Vitest e suporte a geradores arbitrários complexos.

```bash
npm install --save-dev fast-check vitest @vitest/coverage-v8
```

### Testes de Propriedade

Cada propriedade do design deve ser implementada como um teste com `fc.assert(fc.property(...))` com mínimo de 100 iterações.

**Tag format**: `// Feature: cloaker-ads-platform, Property {N}: {título}`

Exemplos de implementação:

```typescript
// Property 7: Geração de slug e prismaId únicos e no formato correto
// Feature: cloaker-ads-platform, Property 7: Geração de slug e prismaId únicos
test('slugs gerados têm 6 chars [A-Z0-9] e são únicos', () => {
  fc.assert(
    fc.property(fc.integer({ min: 2, max: 20 }), async (n) => {
      const slugs = await Promise.all(Array.from({ length: n }, generateSlug))
      expect(slugs.every(s => /^[A-Z0-9]{6}$/.test(s))).toBe(true)
      expect(new Set(slugs).size).toBe(n)
    }),
    { numRuns: 100 }
  )
})

// Property 10: Decisão de redirecionamento baseada em score
// Feature: cloaker-ads-platform, Property 10: Decisão de redirecionamento
test('score >= threshold redireciona para safeUrl', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 0, max: 100 }),  // threshold
      fc.integer({ min: 0, max: 500 }),  // score
      (threshold, score) => {
        const result = decideCloaking({ riskScore: threshold }, score)
        if (score >= threshold) {
          expect(result.destination).toBe('safeUrl')
        } else {
          expect(result.destination).toBe('moneyUrl')
        }
      }
    ),
    { numRuns: 500 }
  )
})

// Property 6: Isolamento de campanhas por usuário
// Feature: cloaker-ads-platform, Property 6: Isolamento de campanhas
test('listagem de campanhas retorna apenas as do usuário autenticado', () => {
  fc.assert(
    fc.property(
      fc.array(fc.record({ userId: fc.string(), name: fc.string() }), { minLength: 2 }),
      async (campaigns) => {
        // seed DB com campanhas de múltiplos usuários
        // verificar que cada usuário só vê as suas
      }
    ),
    { numRuns: 100 }
  )
})
```

### Testes de Exemplo (Unit/Integration)

- **Autenticação**: login com credenciais válidas, login com senha errada, registro com e-mail duplicado, rate limiting após 10 tentativas.
- **Motor de Cloaking**: campanha não encontrada → google.com, campanha pausada → safeUrl, erro de banco → google.com.
- **Domínios**: verificação DNS com CNAME correto, verificação DNS com CNAME incorreto.
- **Planos**: usuário Starter com 3 campanhas tenta criar 4ª → 403.
- **API Key**: usuário Black acessa `/api/v1/campaigns` com API Key válida → 200; usuário Pro → 403.

### Testes de Smoke (Configuração)

- Arquivo `dev.db` não existe no repositório.
- Arquivo `.env.example` existe e documenta todas as variáveis.
- `prisma/schema.prisma` usa provider `postgresql` sem referência a SQLite.
- `wrangler.toml` não contém variáveis sensíveis hardcoded.
- `public/tracker.js` existe e é acessível.

### Cobertura Mínima

- Motor de Cloaking (`app/[slug]/route.ts`): 90%
- Autenticação (`app/api/auth/`): 85%
- Gerenciador de Campanhas (`app/api/campaigns/`): 85%
- Motor de Analytics (`app/api/analytics/`): 80%
- Tracker (`public/tracker.js`): 75%
