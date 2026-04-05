# Plano de Implementação: Cloaker Ads Platform

## Visão Geral

Implementação incremental da plataforma de cloaking de tráfego pago, partindo da limpeza da base de código existente, passando pela autenticação real, motor de cloaking, analytics, tracker comportamental, gerenciamento de domínios e planos, até o deploy no Cloudflare Pages com banco PostgreSQL no EasyPanel.

Stack: Next.js 15 App Router · TypeScript · Prisma ORM · PostgreSQL · Cloudflare Pages · @cloudflare/next-on-pages

---

## Tasks

- [x] 1. Limpeza e segurança da base de código
  - [x] 1.1 Remover `dev.db` do repositório e ajustar `.gitignore`
    - Deletar o arquivo `dev.db` da raiz do projeto
    - Remover qualquer exceção para `*.db` do `.gitignore`
    - Adicionar `*.db` ao `.gitignore` para garantir que não seja commitado novamente
    - _Requirements: 1.1_

  - [x] 1.2 Criar `lib/env.ts` com validação de variáveis de ambiente obrigatórias
    - Validar `DATABASE_URL`, `JWT_SECRET`, `NEXTAUTH_SECRET` na inicialização
    - Encerrar processo com mensagem descritiva se alguma estiver ausente
    - Criar `.env.example` documentando todas as variáveis necessárias sem valores reais
    - _Requirements: 1.2, 1.3, 10.6_

  - [x] 1.3 Remover componentes de dashboard não relacionados ao cloaking
    - Deletar: `assinaturas-dashboard`, `carrinhos-abandonados-dashboard`, `clientes-vendas-dashboard`, `colecoes-dashboard`, `kits-dashboard`, `logistica-dashboard`, `pedido-detalhes`, `pedidos-dashboard`, `produtos-dashboard`
    - Remover imports e referências a esses componentes em `app/page.tsx` e `app/layout.tsx`
    - _Requirements: 1.4_

  - [x] 1.4 Remover dependências não utilizadas do `package.json`
    - Identificar e remover pacotes que eram usados apenas pelos componentes removidos
    - _Requirements: 1.5_

- [x] 2. Schema Prisma e migrations PostgreSQL
  - [x] 2.1 Atualizar `prisma/schema.prisma` com o schema completo do design
    - Adicionar campos `plan`, `apiKey`, `updatedAt` ao model `User`
    - Adicionar campo `userId` obrigatório (não opcional) ao model `Campaign`
    - Adicionar model `BehavioralLog` conforme design
    - Atualizar model `Domain` com campos `userId`, `updatedAt` e relação com `User`
    - Adicionar índices em `TrafficLog` conforme design (`campaignId+createdAt`, `status+createdAt`, `score+createdAt`)
    - Garantir que o provider seja `postgresql` sem nenhuma referência a SQLite
    - _Requirements: 10.3_

  - [x] 2.2 Criar `prisma/migrations/init_postgres.sql` com schema completo
    - Gerar SQL de criação de todas as tabelas, índices e constraints
    - Incluir todos os modelos: User, Campaign, TrafficLog, Domain, BehavioralLog
    - _Requirements: 10.4_

- [ ] 3. Checkpoint — Schema e limpeza
  - Garantir que `prisma/schema.prisma` não referencia SQLite, `dev.db` não existe no repo, `.env.example` está presente. Perguntar ao usuário se há dúvidas antes de continuar.

- [x] 4. Autenticação real de usuários
  - [x] 4.1 Instalar dependências de autenticação
    - Instalar `bcryptjs`, `@types/bcryptjs`, `jsonwebtoken`, `@types/jsonwebtoken`
    - Instalar `fast-check`, `vitest`, `@vitest/coverage-v8` para testes
    - _Requirements: 2.1, 2.3_

  - [x] 4.2 Criar `app/api/auth/register/route.ts`
    - Validar input com Zod: `fullName`, `username`, `email`, `phone?`, `password`, `confirmPassword`
    - Validar formato de e-mail e regras de senha (min 8, 1 maiúscula, 1 minúscula, 1 número)
    - Hash bcrypt com custo 12 antes de persistir
    - Retornar 409 se e-mail ou username já existir
    - Retornar 400 com campos inválidos se validação Zod falhar
    - _Requirements: 2.1, 2.2, 2.8, 11.3, 11.4_

  - [ ]* 4.3 Escrever property test para hash de senha (Property 1)
    - **Property 1: Hash de senha com bcrypt custo >= 12**
    - **Validates: Requirements 2.1**

  - [ ]* 4.4 Escrever property test para unicidade de e-mail e username (Property 2)
    - **Property 2: Unicidade de e-mail e username no registro**
    - **Validates: Requirements 2.2**

  - [ ]* 4.5 Escrever property test para validação de formato (Property 5)
    - **Property 5: Validação de formato de e-mail e senha**
    - **Validates: Requirements 2.8**

  - [x] 4.6 Criar `app/api/auth/login/route.ts`
    - Validar input com Zod: `email`, `password`
    - Comparar senha com bcrypt; retornar 401 genérico se incorreta
    - Emitir JWT com expiração 7 dias assinado com `JWT_SECRET`
    - Setar cookie `token` com flags `HttpOnly`, `Secure`, `SameSite=Strict`, `Max-Age=604800`
    - Implementar rate limiting por IP: máx 10 tentativas/60s → 429 com `Retry-After: 60`
    - _Requirements: 2.3, 2.4, 2.7_

  - [ ]* 4.7 Escrever property test para JWT válido em cookie (Property 3)
    - **Property 3: JWT válido em cookie com flags de segurança**
    - **Validates: Requirements 2.3**

  - [ ]* 4.8 Escrever property test para rejeição de senha incorreta (Property 4)
    - **Property 4: Rejeição de senha incorreta no login**
    - **Validates: Requirements 2.4**

  - [x] 4.9 Criar `middleware.ts` com guard JWT
    - Proteger todas as rotas `/api/*` exceto `/api/auth/*`, `POST /api/analytics` e `/{slug}`
    - Extrair JWT do cookie `token`, verificar assinatura com `JWT_SECRET`
    - Injetar `userId` no header `X-User-Id` para os handlers downstream
    - Redirecionar para `/login` quando JWT ausente/inválido em rotas de dashboard
    - Retornar 401 quando JWT ausente/inválido em rotas de API
    - _Requirements: 2.5, 2.6, 11.1, 11.2_

  - [ ]* 4.10 Escrever property test para proteção de rotas com JWT (Property 18)
    - **Property 18: Proteção de rotas com JWT**
    - **Validates: Requirements 11.1, 11.2**

- [ ] 5. Checkpoint — Autenticação
  - Garantir que registro, login e middleware funcionam corretamente. Perguntar ao usuário se há dúvidas antes de continuar.

- [x] 6. Gerenciamento de campanhas
  - [x] 6.1 Criar `lib/campaign-utils.ts` com funções de geração de slug e prismaId
    - `generateSlug()`: gera string de 6 chars `[A-Z0-9]` única no banco
    - `generatePrismaId()`: gera string de 12 chars `[A-Z0-9]` única no banco
    - Ambas devem regenerar em caso de colisão
    - _Requirements: 3.2, 3.3_

  - [ ]* 6.2 Escrever property test para geração de slug e prismaId (Property 7)
    - **Property 7: Geração de slug e prismaId únicos e no formato correto**
    - **Validates: Requirements 3.2, 3.3**

  - [x] 6.3 Criar `app/api/campaigns/route.ts` (GET + POST)
    - `GET`: retornar apenas campanhas do `userId` extraído do header `X-User-Id`
    - `POST`: validar input com Zod (name, safeUrl, moneyUrl, trafficSource, riskScore?, countries?, languages?, devices?, advancedConfig?)
    - Verificar limite de plano Starter (máx 3 campanhas ativas) → 403 se excedido
    - Gerar slug e prismaId únicos automaticamente
    - Persistir campanha associada ao `userId`
    - _Requirements: 3.1, 3.2, 3.4, 3.5, 8.2, 11.3_

  - [ ]* 6.4 Escrever property test para isolamento de campanhas por usuário (Property 6)
    - **Property 6: Isolamento de campanhas por usuário**
    - **Validates: Requirements 3.5, 3.6, 3.7**

  - [ ]* 6.5 Escrever property test para limite de campanhas Starter (Property 9)
    - **Property 9: Limite de campanhas por plano Starter**
    - **Validates: Requirements 8.2**

  - [x] 6.6 Criar `app/api/campaigns/[id]/route.ts` (GET + PUT + DELETE)
    - `GET`: verificar ownership → 403 se não pertencer ao usuário
    - `PUT`: validar input com Zod, verificar ownership, aplicar alterações
    - `DELETE`: verificar ownership, excluir campanha e TrafficLogs em cascata
    - Suportar `status: 'active' | 'paused'` no PUT para pausar/reativar
    - _Requirements: 3.6, 3.7, 3.8, 3.9, 3.10_

  - [ ]* 6.7 Escrever property test para exclusão em cascata (Property 8)
    - **Property 8: Exclusão em cascata de logs ao deletar campanha**
    - **Validates: Requirements 3.8**

- [x] 7. Motor de Cloaking
  - [x] 7.1 Criar `lib/cloak-engine.ts` com módulos de detecção e função `evaluateCloaking`
    - Implementar interface `CloakContext` e `CloakEvaluation`
    - Módulo PrismaID: +100 se ausente ou incorreto
    - Módulo Bot UA: +80 para strings `bot`, `crawler`, `spider`, `curl`, `wget`, `lighthouse`, `headless`, `python`, `java`
    - Módulo Network UA: +100 para `facebookexternalhit`, `googlebot`, `tiktok`, `bytedance`, `kwai`, `adsbot`
    - Módulo AdSpy: +100 para referrers de ferramentas de espionagem conhecidas
    - Módulo Geo: +50 se país não está na whitelist da campanha
    - Módulo Language: +30 se `accept-language` não contém idioma permitido
    - Módulo Device: +30 se dispositivo não corresponde ao filtro da campanha
    - Módulo ASN: +80 para ASNs de datacenters conhecidos
    - Função `decideCloaking(campaign, score)`: retorna `safeUrl` se score >= threshold, `moneyUrl` caso contrário
    - _Requirements: 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 4.11, 4.12, 4.13_

  - [ ]* 7.2 Escrever property test para decisão de redirecionamento (Property 10)
    - **Property 10: Decisão de redirecionamento baseada em score**
    - **Validates: Requirements 4.12, 4.13**

  - [ ]* 7.3 Escrever property test para incremento de score por módulo (Property 11)
    - **Property 11: Incremento correto de score por módulo de detecção**
    - **Validates: Requirements 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 4.11**

  - [x] 7.4 Atualizar `app/[slug]/route.ts` com o motor de cloaking completo
    - Buscar campanha pelo slug no banco; redirecionar para `https://google.com` se não encontrada
    - Redirecionar para `safeUrl` se campanha pausada
    - Extrair `CloakContext` dos headers Cloudflare (`cf-ipcountry`, `cf-ipasn`, `user-agent`, `accept-language`, `referer`)
    - Chamar `evaluateCloaking` e registrar `TrafficLog` com todos os campos
    - Incrementar `visitors` e `blockedCount` atomicamente via `$transaction`
    - Redirecionar para `safeUrl` ou `moneyUrl` com HTTP 302 conforme score
    - Envolver tudo em try/catch global → redirecionar para `https://google.com` em caso de erro
    - _Requirements: 4.1, 4.2, 4.3, 4.14, 4.15, 4.16_

  - [ ]* 7.5 Escrever property test para registro de TrafficLog (Property 12)
    - **Property 12: Registro de TrafficLog para cada requisição avaliada**
    - **Validates: Requirements 4.14**

- [ ] 8. Checkpoint — Motor de Cloaking
  - Garantir que o motor avalia corretamente e registra logs. Perguntar ao usuário se há dúvidas antes de continuar.

- [x] 9. Tracker comportamental
  - [x] 9.1 Reescrever `public/tracker.js` com coleta completa de dados comportamentais
    - Coletar: fingerprint canvas, CPU cores, device memory, platform, languages, screen resolution, `navigator.webdriver`
    - Detectar `isBot`: `navigator.webdriver === true` ou ausência de `window.chrome`
    - Monitorar: mouse movements, clicks, scroll depth (0-100%), time on page
    - Extrair `campaignId` do parâmetro `utm_campaign` da URL
    - Enviar payload via `navigator.sendBeacon` para `POST /api/analytics` ao sair da página e a cada 10s
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ]* 9.2 Escrever testes unitários para detecção de bot no Tracker (Property 16)
    - **Property 16: Detecção de bot pelo Tracker**
    - **Validates: Requirements 5.3**

  - [ ]* 9.3 Escrever testes unitários para extração de campaignId (Property 17)
    - **Property 17: Extração de campaignId do utm_campaign**
    - **Validates: Requirements 5.6**

  - [x] 9.4 Criar `app/api/analytics/route.ts` — endpoint POST para receber dados do Tracker
    - Aceitar `POST /api/analytics` sem autenticação JWT (rota pública)
    - Validar payload com Zod (TrackerPayload)
    - Persistir `BehavioralLog` associado ao `campaignId`
    - _Requirements: 5.7_

- [x] 10. Motor de Analytics
  - [x] 10.1 Criar `app/api/analytics/route.ts` — endpoint GET com métricas agregadas
    - Protegido por JWT; usar `userId` do header `X-User-Id`
    - Aceitar query params: `campaignId`, `period` (24h | 7d | 30d)
    - Retornar: `summary` (totalVisitors, totalBlocked, blockRate), `byCountry`, `byDevice`, `bySource`, `timeSeries`
    - Filtrar apenas logs das campanhas do usuário autenticado
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 10.2 Escrever property test para isolamento de métricas por usuário (Property 13)
    - **Property 13: Isolamento de métricas de analytics por usuário**
    - **Validates: Requirements 6.1**

  - [ ]* 10.3 Escrever property test para filtragem temporal de logs (Property 14)
    - **Property 14: Filtragem temporal correta de logs**
    - **Validates: Requirements 6.3, 6.6**

  - [x] 10.4 Criar `app/api/analytics/logs/route.ts` — listagem paginada de logs
    - Protegido por JWT
    - Paginação de 50 itens por página, ordenado por `createdAt` decrescente
    - Filtros: `status`, `campaignId`, `country`, `from`, `to`
    - _Requirements: 6.5, 6.6_

  - [ ]* 10.5 Escrever property test para paginação de logs (Property 15)
    - **Property 15: Paginação de logs com 50 itens por página em ordem decrescente**
    - **Validates: Requirements 6.5**

  - [x] 10.6 Criar `app/api/analytics/live/route.ts` — métricas em tempo real
    - Protegido por JWT
    - Retornar últimos 100 TrafficLogs do usuário em ordem decrescente
    - Métricas dos últimos 5 minutos: total, bloqueados, top 5 motivos de bloqueio
    - Distribuição geográfica das últimas 24h
    - TrafficLogs com `score >= 80` das últimas 24h
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [x] 10.7 Criar `app/api/analytics/export/route.ts` — exportação CSV
    - Protegido por JWT
    - Aceitar mesmos filtros de `logs/route.ts`
    - Retornar `Content-Type: text/csv` com todos os logs do período
    - _Requirements: 6.7_

- [ ] 11. Checkpoint — Analytics e Tracker
  - Garantir que métricas, paginação e exportação funcionam. Perguntar ao usuário se há dúvidas antes de continuar.

- [x] 12. Gerenciamento de domínios
  - [x] 12.1 Criar `app/api/domains/route.ts` (GET + POST)
    - `GET`: retornar apenas domínios do usuário autenticado
    - `POST`: validar input com Zod (url sem protocolo), persistir associado ao `userId`
    - _Requirements: 7.1, 7.2_

  - [x] 12.2 Criar `app/api/domains/[id]/route.ts` (DELETE) e `app/api/domains/[id]/verify/route.ts` (POST)
    - `DELETE`: verificar ownership, excluir domínio
    - `POST /verify`: realizar lookup DNS CNAME, atualizar `isActive` conforme resultado
    - Retornar instruções DNS com `CNAME_TARGET` da variável de ambiente
    - Retornar erro descritivo se verificação DNS falhar
    - _Requirements: 7.3, 7.4, 7.5, 7.6_

- [x] 13. Planos e API Key (plano Black)
  - [x] 13.1 Atualizar `app/api/campaigns/route.ts` com verificação de limite por plano
    - Verificar `user.plan` ao criar campanha
    - Starter: máx 3 campanhas ativas → 403 se excedido
    - Pro e Black: sem limite
    - _Requirements: 8.1, 8.2_

  - [x] 13.2 Criar `app/api/v1/campaigns/route.ts` — endpoint de API pública para plano Black
    - Autenticação por API Key no header `Authorization: Bearer <apiKey>`
    - Retornar 403 se usuário não for plano `black`
    - _Requirements: 8.4_

- [x] 14. Segurança geral das APIs
  - [x] 14.1 Adicionar headers de segurança HTTP em todas as respostas de API
    - `X-Content-Type-Options: nosniff`
    - `X-Frame-Options: DENY`
    - `Referrer-Policy: no-referrer`
    - Implementar via helper `lib/api-response.ts` ou no `middleware.ts`
    - _Requirements: 11.5_

  - [ ]* 14.2 Escrever property test para headers de segurança (Property 20)
    - **Property 20: Headers de segurança em todas as respostas**
    - **Validates: Requirements 11.5**

  - [x] 14.3 Configurar CORS restrito no `middleware.ts`
    - Aceitar apenas origens definidas em `ALLOWED_ORIGINS` (variável de ambiente)
    - _Requirements: 11.6_

  - [ ]* 14.4 Escrever property test para validação Zod retorna 400 (Property 19)
    - **Property 19: Validação Zod retorna 400 com campos inválidos**
    - **Validates: Requirements 11.3, 11.4**

- [ ] 15. Checkpoint — Segurança e planos
  - Garantir que headers de segurança, CORS e limites de plano estão corretos. Perguntar ao usuário se há dúvidas antes de continuar.

- [-] 16. Configuração do repositório GitHub
  - [ ] 16.1 Inicializar repositório Git e configurar remote
    - Executar `git init` se ainda não inicializado
    - Adicionar remote origin: `git remote add origin <URL_DO_REPOSITORIO>`
    - Verificar que `.gitignore` inclui: `node_modules/`, `.next/`, `.env*`, `*.db`, `lib/generated/`
    - _Requirements: 10.1_

  - [-] 16.2 Fazer commit inicial e push para o repositório
    - Adicionar todos os arquivos: `git add .`
    - Commit: `git commit -m "feat: initial cloaker-ads-platform implementation"`
    - Push: `git push -u origin main`
    - _Requirements: 10.1_

- [x] 17. Configuração do Cloudflare Pages com @cloudflare/next-on-pages
  - [x] 17.1 Instalar e configurar `@cloudflare/next-on-pages`
    - Instalar: `npm install --save-dev @cloudflare/next-on-pages wrangler`
    - Atualizar `next.config.mjs` para compatibilidade com Cloudflare Pages (remover `output: 'standalone'`, adicionar `experimental.runtime: 'edge'` onde necessário)
    - Adicionar script de build no `package.json`: `"pages:build": "npx @cloudflare/next-on-pages"`
    - _Requirements: 10.1, 10.5_

  - [x] 17.2 Atualizar `wrangler.toml` para deploy no Cloudflare Pages
    - Definir `name` com o nome do projeto no Cloudflare Pages
    - Definir `compatibility_date` atualizado
    - Definir `pages_build_output_dir = ".vercel/output/static"` (saída do `@cloudflare/next-on-pages`)
    - Adicionar `compatibility_flags = ["nodejs_compat"]`
    - Garantir que nenhuma variável sensível está hardcoded — apenas `NODE_ENV = "production"` em `[vars]`
    - Documentar no comentário do arquivo que `DATABASE_URL`, `JWT_SECRET` e `NEXTAUTH_SECRET` devem ser configurados no painel do Cloudflare
    - _Requirements: 10.1, 10.2_

  - [x] 17.3 Adicionar `prisma/migrations/init_postgres.sql` atualizado e instruções de deploy
    - Garantir que o SQL de init está completo e atualizado com todos os modelos do schema final
    - Criar `DEPLOY.md` com instruções de: configurar variáveis no Cloudflare Dashboard, rodar migration no EasyPanel, conectar repositório GitHub ao Cloudflare Pages
    - _Requirements: 10.4_

- [ ] 18. Checkpoint final — Deploy e integração
  - Garantir que `wrangler.toml` está correto, `@cloudflare/next-on-pages` está configurado, repositório está no GitHub e o build de produção funciona. Perguntar ao usuário se há dúvidas antes de finalizar.

---

## Notas

- Tasks marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Cada task referencia os requisitos específicos para rastreabilidade
- Os property tests usam `fast-check` com mínimo de 100 iterações cada
- O motor de cloaking deve rodar no Edge Runtime do Cloudflare Workers via `@cloudflare/next-on-pages`
- Variáveis sensíveis (`DATABASE_URL`, `JWT_SECRET`, `NEXTAUTH_SECRET`) devem ser configuradas exclusivamente no painel do Cloudflare — nunca no `wrangler.toml`
