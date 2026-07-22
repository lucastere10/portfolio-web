# Portfolio — Lucas Caldas

Site pessoal (case studies, projetos, labs interativos e chat com agent) em Next.js App Router, com conteúdo em MDX e i18n (`pt-BR` / `en`).

## Stack

- Next.js 16 (App Router), React 19, TypeScript, Tailwind
- **next-intl** — routing e UI strings (`messages/*.json`)
- Conteúdo editorial — MDX em `content/{work,projects,labs,pages}/`
- Loaders — `src/content/*` (Zod + gray-matter, `server-only`)
- Chat — browser → `POST /api/agent/chat` (BFF) → [portfolio-agent](../portfolio-agent) (nunca chamar o agent direto do browser)
- Contato — Resend via `POST /api/contact`

## Internacionalização

| Locale | Prefixo | Exemplo |
|--------|---------|---------|
| `pt-BR` (default) | nenhum | `/work/ai-agents-adk` |
| `en` | `/en` | `/en/work/ai-agents-adk` |

- UI chrome: `messages/pt-BR.json` + `messages/en.json`
- Editorial: `content/<tipo>/<slug>/{pt-BR,en}.mdx` (+ `meta.json` para work/projects/labs)
- Validação dual-locale: `pnpm validate:locales` (roda no `prebuild`)
- Detalhes: [`docs/architecture-roadmap.md`](docs/architecture-roadmap.md) · [`AGENTS.md`](AGENTS.md)

## Como adicionar conteúdo

### Work / project

1. Criar `content/work/<slug>/` ou `content/projects/<slug>/`
2. `meta.json` + `pt-BR.mdx` + `en.mdx` (ambos obrigatórios)
3. `pnpm validate:locales` · `pnpm build`
4. Abrir `/work/<slug>` e `/en/work/<slug>` (ou `/projects/...`)

### Lab

1. `content/labs/<slug>/meta.json` com `demoKey`
2. MDX nos dois locales
3. Componente em `src/components/labs/demos/`
4. Registrar em `LAB_DEMO_REGISTRY`

## Scripts

```bash
pnpm dev                 # desenvolvimento
pnpm build               # validate:locales + next build
pnpm validate:locales    # dual MDX + parity de messages
pnpm typecheck
pnpm test
```

## Agent API (BFF)

O browser nunca chama o agent diretamente. O chat usa `POST /api/agent/chat`, que:

- Valida origem (`Origin`/`Referer`) em produção
- Aplica rate limit leve (20 req/min por IP)
- Envia ID token GCP ao agent em produção (`src/lib/agent/auth.ts`)

### Variáveis de ambiente

| Variável | Descrição | Default local |
|----------|-----------|---------------|
| `PORTFOLIO_AGENT_BASE_URL` | URL do portfolio-agent | `http://localhost:8000` |
| `PORTFOLIO_WEB_BASE_URL` | Origem permitida no BFF / URL canônica | `http://localhost:3000` |
| `AGENT_REQUEST_TIMEOUT_MS` | Timeout da chamada ao agent | `30000` |
| `RESEND_API_KEY` | Chave da API Resend (formulário de contato) | — |
| `CONTACT_FROM_EMAIL` | Remetente verificado no Resend | — |
| `CONTACT_TO_EMAIL` | Destino das mensagens do formulário | — |
| `INSIGHTS_ACCESS_TOKEN` | Token para `/labs/insights?token=` (obrigatório em produção) | — |

## Deploy (Cloud Run + Cloud Build)

O pipeline em `cloudbuild.yaml`:

1. Build da imagem Docker
2. Push (`latest` e `$SHORT_SHA`)
3. Deploy no Cloud Run com env vars e secret Resend

### Setup único no GCP

```bash
# Formulário de contato (Resend)
echo -n 're_YOUR_KEY' | gcloud secrets create RESEND_API_KEY --data-file=-

gcloud secrets add-iam-policy-binding RESEND_API_KEY \
  --member="serviceAccount:399951936554-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

Substitutions do deploy (agent, contato, SA) ficam no topo de `cloudbuild.yaml`.

### Cloud Build Trigger (GitHub)

1. Conecte o repositório em **Cloud Build → Repositories**
2. Trigger na branch `^main$` → **arquivo** `cloudbuild.yaml` do repositório (não use YAML inline)
3. Remova substitutions conflitantes do template padrão (`_AR_REPOSITORY=cloud-run-source-deploy`, etc.)

### CI no GitHub

PRs e pushes em `main` rodam lint, typecheck e testes via `.github/workflows/ci.yml`. O deploy é disparado pelo Cloud Build Trigger (não pelo Actions).
