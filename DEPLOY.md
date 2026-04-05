# Deploy — Cloaker Hub

## 1. Banco de dados PostgreSQL (EasyPanel)

1. No EasyPanel, crie um serviço PostgreSQL
2. Copie a `DATABASE_URL` no formato: `postgresql://user:password@host:5432/dbname`
3. Conecte ao banco e execute o script de inicialização:
   ```bash
   psql $DATABASE_URL -f prisma/migrations/init_postgres.sql
   ```

## 2. Variáveis de ambiente no Cloudflare Pages

No painel do Cloudflare → Pages → **cloaker-hub** → Settings → Environment variables, adicione:

| Variável | Valor |
|---|---|
| `DATABASE_URL` | `postgresql://...` (do EasyPanel) |
| `JWT_SECRET` | string aleatória ≥ 32 chars (`openssl rand -base64 32`) |
| `NEXTAUTH_SECRET` | string aleatória ≥ 32 chars |
| `CNAME_TARGET` | seu domínio Cloudflare Pages (ex: `cloaker-hub.pages.dev`) |
| `ALLOWED_ORIGINS` | domínio do seu app (ex: `https://app.seudominio.com`) |

## 3. Conectar repositório GitHub ao Cloudflare Pages

1. Acesse: https://dash.cloudflare.com → Pages → Create a project → Connect to Git
2. Selecione o repositório: `HumanC0de1877/Grok-Cloaker`
3. Configure o build:
   - **Framework preset**: Next.js
   - **Build command**: `npm run pages:build`
   - **Build output directory**: `.vercel/output/static`
4. Clique em **Save and Deploy**

## 4. Deploy manual (opcional)

```bash
npm install
npm run pages:build
npx wrangler pages deploy .vercel/output/static --project-name=cloaker-hub
```

## 5. Prisma Client

O Prisma Client é gerado em `lib/generated/prisma`. Para regenerar:
```bash
npx prisma generate
```
