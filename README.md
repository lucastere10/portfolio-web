This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Agent API (BFF)

O browser nunca chama o agent diretamente. O chat usa `POST /api/agent/chat`, que:

- Valida origem (`Origin`/`Referer`) em produção
- Aplica rate limit leve (20 req/min por IP)
- Envia ID token GCP ao agent em produção (`src/lib/agent-auth.ts`)

### Variáveis de ambiente

| Variável | Descrição | Default local |
|----------|-----------|---------------|
| `PORTFOLIO_AGENT_BASE_URL` | URL do portfolio-agent | `http://localhost:8000` |
| `PORTFOLIO_WEB_BASE_URL` | Origem permitida no BFF | `http://localhost:3000` |
| `AGENT_REQUEST_TIMEOUT_MS` | Timeout da chamada ao agent | `30000` |
| `RESEND_API_KEY` | Chave da API Resend (formulário de contato) | — |
| `CONTACT_FROM_EMAIL` | Remetente verificado no Resend | — |
| `CONTACT_TO_EMAIL` | Destino das mensagens do formulário | — |

## Deploy (Cloud Run + Cloud Build)

O pipeline em `cloudbuild.yaml`:

1. Valida que o serviço `portfolio-agent` existe
2. Build e push (tags `latest` e `$SHORT_SHA`)
3. Deploy como `portfolio-web` com SA dedicada
4. Smoke test: impersona `portfolio-web` e valida `GET /health` no agent

### Setup único no GCP

```bash
# Service account (se ainda não criada — ver também portfolio-agent README)
gcloud iam service-accounts create portfolio-web --display-name="Portfolio Web"

# Permissão da Cloud Build SA para smoke tests
PROJECT_NUMBER=$(gcloud projects describe PROJECT_ID --format='value(projectNumber)')
gcloud iam service-accounts add-iam-policy-binding \
  portfolio-web@PROJECT_ID.iam.gserviceaccount.com \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountTokenCreator"

# Formulário de contato (Resend) — secret + acesso da SA do Cloud Run
echo -n 're_YOUR_KEY' | gcloud secrets create RESEND_API_KEY --data-file=-

gcloud secrets add-iam-policy-binding RESEND_API_KEY \
  --member="serviceAccount:portfolio-web@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

O deploy em `cloudbuild.yaml` injeta `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` e monta `RESEND_API_KEY` via Secret Manager. **Importante:** use um único `--set-env-vars` no deploy — vários flags se substituem e só o último permanece.

### Cloud Build Trigger (GitHub)

1. Conecte `lucastere10/portfolio_web` em **Cloud Build → Repositories**
2. Trigger `deploy-portfolio-web` na branch `^main$` → `cloudbuild.yaml`
3. Deploy do **agent antes** do web quando ambos mudarem

### CI no GitHub

PRs e pushes em `main` rodam lint, typecheck e testes via `.github/workflows/ci.yml`. O deploy é disparado pelo Cloud Build Trigger (não pelo Actions).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
