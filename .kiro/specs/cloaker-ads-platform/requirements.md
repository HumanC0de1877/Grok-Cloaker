# Documento de Requisitos

## Introdução

Sistema de cloaking para tráfego pago (Facebook Ads, TikTok Ads, Google Ads e Kwai Ads) com motor de filtragem inteligente, autenticação real, gerenciamento de campanhas, rastreamento comportamental, analytics em tempo real e painel administrativo completo. A plataforma é hospedada no Cloudflare (Pages + Workers) com banco de dados PostgreSQL em VPS via EasyPanel. O sistema não deve conter dados hardcoded, credenciais expostas, banco SQLite local (dev.db) ou qualquer "porta de entrada" não autenticada.

---

## Glossário

- **Cloaker**: Sistema que detecta a origem de um visitante e redireciona bots, moderadores de plataformas de anúncios e tráfego suspeito para uma página segura (Safe Page), enquanto usuários reais são enviados para a página de oferta (Money Page).
- **Safe Page**: Página inócua exibida a bots, crawlers e moderadores de plataformas de anúncios.
- **Money Page**: Página de oferta real exibida a visitantes humanos qualificados.
- **Slug**: Identificador único de URL de uma campanha (ex: `/ABC123/`).
- **PrismaID**: Token secreto de bypass que deve estar presente na URL do anúncio para que o visitante seja considerado legítimo.
- **Risk Score**: Pontuação de 0 a 100 calculada pelo motor de cloaking para cada visitante. Quanto maior, mais suspeito.
- **TrafficLog**: Registro de cada acesso a uma campanha, contendo IP, país, dispositivo, status e motivo.
- **Fingerprint**: Identificador único gerado no navegador do visitante a partir de características de hardware e software.
- **ASN**: Número de Sistema Autônomo — identifica o provedor de rede de um IP.
- **Sistema**: A plataforma de cloaking como um todo.
- **Motor_de_Cloaking**: Componente responsável por avaliar cada requisição e decidir entre redirecionar para Safe Page ou Money Page.
- **Autenticador**: Componente responsável por registro, login e validação de sessão de usuários.
- **Gerenciador_de_Campanhas**: Componente responsável por criar, editar, listar e excluir campanhas.
- **Motor_de_Analytics**: Componente responsável por agregar e expor métricas de tráfego.
- **Tracker**: Script JavaScript público injetado na Money Page para coleta de dados comportamentais pós-clique.
- **Gerenciador_de_Domínios**: Componente responsável por registrar e verificar domínios customizados.
- **Plano**: Nível de assinatura do usuário que define limites de uso da plataforma.

---

## Requisitos

### Requisito 1: Limpeza e Segurança da Base de Código

**User Story:** Como operador da plataforma, quero que o sistema não contenha dados hardcoded, credenciais expostas ou arquivos de banco de dados locais, para que a operação seja segura e auditável.

#### Critérios de Aceitação

1. THE Sistema SHALL remover o arquivo `dev.db` do repositório e do `.gitignore` não deverá constar exceção para arquivos `.db`.
2. THE Sistema SHALL ler todas as variáveis sensíveis (DATABASE_URL, JWT_SECRET, NEXTAUTH_SECRET) exclusivamente de variáveis de ambiente, nunca de valores literais no código.
3. IF uma variável de ambiente obrigatória estiver ausente na inicialização, THEN THE Sistema SHALL encerrar o processo com mensagem de erro descritiva antes de aceitar qualquer requisição.
4. THE Sistema SHALL remover componentes de dashboard não relacionados ao cloaking (carrinhos abandonados, clientes/vendas, coleções, kits, logística, pedidos, produtos) do código-fonte.
5. THE Sistema SHALL remover dependências de pacotes não utilizados após a limpeza dos componentes.

---

### Requisito 2: Autenticação Real de Usuários

**User Story:** Como usuário, quero criar uma conta e fazer login com verificação real, para que apenas eu tenha acesso ao meu painel e campanhas.

#### Critérios de Aceitação

1. WHEN um visitante submete o formulário de registro com nome completo, username, e-mail, telefone e senha, THE Autenticador SHALL criar o registro do usuário no banco de dados PostgreSQL com a senha armazenada como hash bcrypt de custo mínimo 12.
2. IF o e-mail ou username já existir no banco de dados, THEN THE Autenticador SHALL retornar erro HTTP 409 com mensagem indicando o campo duplicado.
3. WHEN um usuário submete o formulário de login com e-mail e senha válidos, THE Autenticador SHALL emitir um JWT assinado com expiração de 7 dias e armazená-lo em cookie HttpOnly, Secure, SameSite=Strict.
4. IF a senha fornecida no login não corresponder ao hash armazenado, THEN THE Autenticador SHALL retornar erro HTTP 401 sem revelar qual campo está incorreto.
5. WHILE um usuário possui sessão JWT válida, THE Autenticador SHALL permitir acesso às rotas protegidas do dashboard.
6. WHEN o JWT expirar ou for inválido, THE Autenticador SHALL redirecionar o usuário para a página de login.
7. THE Autenticador SHALL implementar rate limiting de no máximo 10 tentativas de login por IP por minuto, retornando HTTP 429 quando excedido.
8. THE Autenticador SHALL validar o formato do e-mail e exigir senha com mínimo de 8 caracteres contendo ao menos uma letra maiúscula, uma minúscula e um número.

---

### Requisito 3: Gerenciamento de Campanhas

**User Story:** Como usuário autenticado, quero criar e gerenciar campanhas de cloaking, para que eu possa proteger meus anúncios em múltiplas plataformas.

#### Critérios de Aceitação

1. WHEN um usuário autenticado submete o formulário de criação de campanha com nome, Safe URL, Money URL e fonte de tráfego, THE Gerenciador_de_Campanhas SHALL persistir a campanha no banco de dados associada ao `userId` do usuário autenticado.
2. THE Gerenciador_de_Campanhas SHALL gerar automaticamente um `slug` único de 6 caracteres alfanuméricos maiúsculos e um `prismaId` único de 12 caracteres alfanuméricos maiúsculos para cada nova campanha.
3. IF o `slug` ou `prismaId` gerado já existir no banco de dados, THEN THE Gerenciador_de_Campanhas SHALL regenerar o valor até obter um único.
4. THE Gerenciador_de_Campanhas SHALL aceitar as seguintes fontes de tráfego: `facebook`, `tiktok`, `google`, `kwai`.
5. WHEN um usuário autenticado solicita a listagem de campanhas, THE Gerenciador_de_Campanhas SHALL retornar apenas as campanhas pertencentes ao `userId` do usuário autenticado.
6. WHEN um usuário autenticado solicita a edição de uma campanha, THE Gerenciador_de_Campanhas SHALL verificar que a campanha pertence ao usuário antes de aplicar as alterações.
7. IF um usuário tentar acessar ou modificar uma campanha de outro usuário, THEN THE Gerenciador_de_Campanhas SHALL retornar HTTP 403.
8. WHEN um usuário autenticado solicita a exclusão de uma campanha, THE Gerenciador_de_Campanhas SHALL excluir a campanha e todos os seus `TrafficLog` associados do banco de dados.
9. THE Gerenciador_de_Campanhas SHALL permitir configurar por campanha: lista de países permitidos (ISO 3166-1 alpha-2), lista de idiomas do navegador, filtro de dispositivo (mobile/desktop), score de risco máximo (0–100) e módulos avançados de detecção.
10. THE Gerenciador_de_Campanhas SHALL permitir pausar e reativar campanhas alterando o campo `status` entre `active` e `paused`.

---

### Requisito 4: Motor de Cloaking (Roteamento de Tráfego)

**User Story:** Como usuário, quero que o sistema avalie cada visitante em tempo real e redirecione bots e moderadores para a Safe Page, para que meus anúncios não sejam reprovados.

#### Critérios de Aceitação

1. WHEN uma requisição chega em `/{slug}`, THE Motor_de_Cloaking SHALL buscar a campanha pelo `slug` no banco de dados e executar a avaliação de risco antes de qualquer redirecionamento.
2. IF a campanha com o `slug` solicitado não existir, THEN THE Motor_de_Cloaking SHALL redirecionar para `https://google.com` com HTTP 302.
3. IF a campanha estiver com `status = paused`, THEN THE Motor_de_Cloaking SHALL redirecionar para a Safe URL da campanha.
4. WHEN o parâmetro `prismaid` na URL não corresponder ao `prismaId` da campanha, THE Motor_de_Cloaking SHALL incrementar o Risk Score em 100 pontos e redirecionar para a Safe URL.
5. WHEN o `user-agent` da requisição contiver strings de bots conhecidos (`bot`, `crawler`, `spider`, `curl`, `wget`, `lighthouse`, `headless`, `python`, `java`), THE Motor_de_Cloaking SHALL incrementar o Risk Score em 80 pontos.
6. WHEN o `user-agent` contiver assinaturas de crawlers de plataformas de anúncios (`facebookexternalhit`, `googlebot`, `tiktok`, `bytedance`, `kwai`, `adsbot`), THE Motor_de_Cloaking SHALL incrementar o Risk Score em 100 pontos.
7. WHEN o header `referer` contiver domínios de ferramentas AdSpy conhecidas, THE Motor_de_Cloaking SHALL incrementar o Risk Score em 100 pontos.
8. WHEN a campanha tiver filtro geográfico configurado e o país do visitante (via header `cf-ipcountry`) não estiver na lista de países permitidos, THE Motor_de_Cloaking SHALL incrementar o Risk Score em 50 pontos.
9. WHEN a campanha tiver filtro de idioma configurado e o header `accept-language` não contiver nenhum dos idiomas permitidos, THE Motor_de_Cloaking SHALL incrementar o Risk Score em 30 pontos.
10. WHEN a campanha tiver filtro de dispositivo configurado e o dispositivo detectado pelo `user-agent` não corresponder ao tipo permitido, THE Motor_de_Cloaking SHALL incrementar o Risk Score em 30 pontos.
11. WHEN o ASN do visitante (via header `cf-ipasn`) pertencer a uma lista de ASNs de datacenters conhecidos, THE Motor_de_Cloaking SHALL incrementar o Risk Score em 80 pontos.
12. WHEN o Risk Score acumulado for maior ou igual ao `riskScore` configurado na campanha, THE Motor_de_Cloaking SHALL redirecionar para a Safe URL com HTTP 302.
13. WHEN o Risk Score acumulado for menor que o `riskScore` configurado na campanha, THE Motor_de_Cloaking SHALL redirecionar para a Money URL com HTTP 302.
14. THE Motor_de_Cloaking SHALL registrar um `TrafficLog` para cada requisição avaliada, contendo: `campaignId`, `ip`, `country`, `device`, `platform`, `status` (`allowed` ou `blocked`), `reason` e `score`.
15. THE Motor_de_Cloaking SHALL incrementar os contadores `visitors` e `blockedCount` da campanha de forma atômica após cada avaliação.
16. IF ocorrer qualquer erro durante a avaliação, THEN THE Motor_de_Cloaking SHALL redirecionar para `https://google.com` com HTTP 302 sem expor detalhes do erro.

---

### Requisito 5: Rastreamento Comportamental (Tracker)

**User Story:** Como usuário, quero coletar dados comportamentais dos visitantes na Money Page, para que eu possa identificar padrões de bots pós-clique.

#### Critérios de Aceitação

1. THE Tracker SHALL ser um arquivo JavaScript público servido em `/tracker.js` que pode ser injetado em qualquer página via tag `<script>`.
2. WHEN o Tracker é carregado, THE Tracker SHALL coletar: fingerprint de canvas, número de núcleos de CPU, memória do dispositivo, plataforma, idiomas do navegador, resolução de tela e presença de `navigator.webdriver`.
3. WHEN o Tracker detecta `navigator.webdriver = true` ou ausência do objeto `window.chrome`, THE Tracker SHALL marcar a sessão como `isBot = true`.
4. THE Tracker SHALL monitorar continuamente: movimentos de mouse, cliques, profundidade de scroll e tempo na página.
5. WHEN o visitante sai da página ou a cada 10 segundos, THE Tracker SHALL enviar os dados coletados para `POST /api/analytics` usando `navigator.sendBeacon`.
6. THE Tracker SHALL extrair o `campaignId` do parâmetro `utm_campaign` da URL atual.
7. WHEN `POST /api/analytics` recebe dados do Tracker, THE Motor_de_Analytics SHALL persistir os dados comportamentais associados ao `campaignId` no banco de dados.

---

### Requisito 6: Analytics e Métricas

**User Story:** Como usuário autenticado, quero visualizar métricas de tráfego das minhas campanhas, para que eu possa monitorar a efetividade do cloaking.

#### Critérios de Aceitação

1. WHEN um usuário autenticado acessa o dashboard de analytics, THE Motor_de_Analytics SHALL retornar métricas agregadas apenas das campanhas pertencentes ao usuário autenticado.
2. THE Motor_de_Analytics SHALL expor as seguintes métricas por campanha: total de visitantes, total de bloqueados, taxa de bloqueio (%), distribuição por país, distribuição por dispositivo e distribuição por fonte de tráfego.
3. THE Motor_de_Analytics SHALL suportar filtro por período: últimas 24 horas, últimos 7 dias e últimos 30 dias.
4. THE Motor_de_Analytics SHALL expor dados de série temporal (visitantes e bloqueados por hora) para o período selecionado.
5. WHEN um usuário autenticado acessa os logs de tráfego, THE Motor_de_Analytics SHALL retornar os `TrafficLog` paginados (50 por página) das campanhas do usuário, ordenados por `createdAt` decrescente.
6. THE Motor_de_Analytics SHALL permitir filtrar logs por: status (`allowed`/`blocked`), campanha, país e intervalo de datas.
7. THE Motor_de_Analytics SHALL expor um endpoint `GET /api/analytics/export` que retorna os logs em formato CSV para o período e filtros selecionados.

---

### Requisito 7: Gerenciamento de Domínios

**User Story:** Como usuário autenticado, quero registrar domínios customizados e verificar sua configuração DNS, para que minhas campanhas usem URLs próprias.

#### Critérios de Aceitação

1. WHEN um usuário autenticado adiciona um domínio, THE Gerenciador_de_Domínios SHALL persistir o domínio no banco de dados associado ao `userId` do usuário.
2. THE Gerenciador_de_Domínios SHALL retornar apenas os domínios pertencentes ao usuário autenticado.
3. WHEN um usuário solicita a verificação de um domínio, THE Gerenciador_de_Domínios SHALL realizar uma consulta DNS para verificar se o registro CNAME aponta para o destino correto e atualizar o campo `isActive` conforme o resultado.
4. IF a verificação DNS falhar, THEN THE Gerenciador_de_Domínios SHALL retornar mensagem de erro indicando que o registro DNS não foi encontrado ou está incorreto.
5. THE Gerenciador_de_Domínios SHALL exibir as instruções de configuração DNS (tipo, nome e valor do registro CNAME) dinamicamente com base no domínio de destino configurado via variável de ambiente.
6. WHEN um usuário remove um domínio, THE Gerenciador_de_Domínios SHALL excluir o registro do banco de dados.

---

### Requisito 8: Planos e Limites de Uso

**User Story:** Como usuário, quero visualizar os planos disponíveis e entender os limites do meu plano atual, para que eu saiba o que posso usar na plataforma.

#### Critérios de Aceitação

1. THE Sistema SHALL associar cada usuário a um plano (`starter`, `pro`, `black`) com os seguintes limites: Starter — 3 campanhas ativas, 1 domínio; Pro — campanhas ilimitadas, domínios ilimitados; Black — tudo do Pro mais acesso à API.
2. WHEN um usuário no plano Starter tenta criar uma 4ª campanha ativa, THE Gerenciador_de_Campanhas SHALL retornar HTTP 403 com mensagem indicando o limite do plano.
3. THE Sistema SHALL exibir no dashboard o plano atual do usuário, o número de campanhas ativas e o limite do plano.
4. WHERE o plano do usuário for `black`, THE Sistema SHALL disponibilizar o endpoint `GET /api/v1/campaigns` com autenticação por API Key para integração externa.

---

### Requisito 9: Live View e Monitoramento em Tempo Real

**User Story:** Como usuário autenticado, quero visualizar o tráfego das minhas campanhas em tempo real, para que eu possa reagir rapidamente a anomalias.

#### Critérios de Aceitação

1. WHEN um usuário autenticado acessa o Live View, THE Motor_de_Analytics SHALL retornar os últimos 100 `TrafficLog` das campanhas do usuário em ordem cronológica decrescente.
2. THE Motor_de_Analytics SHALL expor um endpoint `GET /api/analytics/live` que retorna métricas dos últimos 5 minutos: total de acessos, total de bloqueados e os 5 motivos de bloqueio mais frequentes.
3. THE Motor_de_Analytics SHALL expor dados de distribuição geográfica dos visitantes das últimas 24 horas para exibição no mapa global.
4. WHEN um usuário autenticado acessa o painel de atividade suspeita, THE Motor_de_Analytics SHALL retornar os `TrafficLog` com `score >= 80` das últimas 24 horas das campanhas do usuário.

---

### Requisito 10: Infraestrutura e Deploy (Cloudflare + EasyPanel)

**User Story:** Como operador, quero que o sistema seja deployado no Cloudflare Pages com banco de dados PostgreSQL no EasyPanel, para que a operação seja escalável e sem servidor próprio.

#### Critérios de Aceitação

1. THE Sistema SHALL ser configurado para build e deploy via Cloudflare Pages com o arquivo `wrangler.toml` sem nenhuma variável sensível hardcoded.
2. THE Sistema SHALL conectar ao banco de dados PostgreSQL exclusivamente via `DATABASE_URL` definida como variável de ambiente no painel do Cloudflare.
3. THE Sistema SHALL utilizar o Prisma ORM com provider `postgresql` e sem nenhuma referência a SQLite no schema ou nas migrations.
4. THE Sistema SHALL incluir um arquivo `prisma/migrations/init_postgres.sql` com o schema completo e atualizado para criação do banco do zero.
5. THE Sistema SHALL configurar o `next.config.mjs` com `output: 'standalone'` ou configuração equivalente compatível com Cloudflare Pages.
6. THE Sistema SHALL incluir um arquivo `.env.example` documentando todas as variáveis de ambiente necessárias sem valores reais.

---

### Requisito 11: Segurança Geral das APIs

**User Story:** Como operador, quero que todas as rotas de API sejam protegidas e não exponham dados de outros usuários, para que o sistema seja seguro por design.

#### Critérios de Aceitação

1. THE Sistema SHALL proteger todas as rotas `/api/*` (exceto `/api/track`, `/{slug}` e `POST /api/auth/*`) com verificação de JWT válido.
2. WHEN uma requisição chega a uma rota protegida sem JWT válido, THE Sistema SHALL retornar HTTP 401.
3. THE Sistema SHALL implementar validação de entrada com Zod em todos os endpoints de escrita (POST, PUT, PATCH, DELETE).
4. IF a validação de entrada falhar, THEN THE Sistema SHALL retornar HTTP 400 com lista dos campos inválidos.
5. THE Sistema SHALL adicionar os headers de segurança HTTP: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer` em todas as respostas.
6. THE Sistema SHALL implementar CORS restrito, aceitando apenas origens configuradas via variável de ambiente.
7. THE Motor_de_Cloaking SHALL ser a única rota pública de redirecionamento — a rota `/{slug}` não requer autenticação de usuário, apenas o `prismaid` correto.
