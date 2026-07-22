# AGENTS.md — Portfolio

Instruções permanentes para agentes de código neste repositório.

## Fonte da verdade

Leia e siga **[`docs/architecture-roadmap.md`](docs/architecture-roadmap.md)** antes de refatorar conteúdo, pastas ou i18n.

Este arquivo é o índice operacional. O roadmap tem o detalhe (diagnóstico, schemas, etapas, checklists).

## Decisões travadas (não reabrir)

| Tema | Escolha |
|------|---------|
| Default locale | `pt-BR` |
| URLs | Sem prefixo no default: `/work/...` = pt-BR; inglês = `/en/work/...` |
| Conteúdo editorial | MDX (`meta.json` + `pt-BR.mdx` / `en.mdx`) sob `content/` |
| UI strings | `messages/pt-BR.json` + `messages/en.json` via **next-intl** |
| Slugs | Locale-agnostic |
| APIs | Fora de locale (`/api/*`) |
| Banco | Não — arquivos versionados |

## Fluxo de trabalho por etapa

1. Trabalhe **uma etapa por vez** (E0 → E1 → … → E8).
2. Não inicie **E6** (routing i18n) antes de **E2–E5** estabilizarem a camada de conteúdo.
3. Ao concluir uma etapa: marque os checkboxes e o **Status** no roadmap.
4. Respeite a seção **Não fazer** da etapa atual.
5. Não faça commit a menos que o usuário peça explicitamente.

### Etapas (resumo)

| Etapa | Objetivo |
|-------|----------|
| **E0** | Docs + AGENTS + Cursor rules (done) |
| **E1** | Schemas Zod, loaders, reorganizar `src/lib` (done) |
| **E2** | Migrar work → `content/work/<slug>/` (done) |
| **E3** | Migrar personal projects → `content/projects/<slug>/` (done) |
| **E4** | Migrar labs (meta + MDX; demos nos components) (done) |
| **E5** | Extrair about/home/domains/nav → content + messages (done) |
| **E6** | next-intl + `app/[locale]` (pt-BR unprefixed) (done) |
| **E7** | Completar EN + validação estrita de locales (done) |
| **E8** | Cleanup, sitemap/hreflang, README (done) |

Roadmap E0–E8 concluído. Para manutenção, siga as convenções deste arquivo e do roadmap.

## Regras Cursor

| Rule | Quando |
|------|--------|
| [`.cursor/rules/portfolio-architecture.mdc`](.cursor/rules/portfolio-architecture.mdc) | Sempre — princípios e decisões |
| [`.cursor/rules/stage-content-mdx.mdc`](.cursor/rules/stage-content-mdx.mdc) | Arquivos em `content/**` |
| [`.cursor/rules/stage-i18n.mdc`](.cursor/rules/stage-i18n.mdc) | i18n, messages, app routes |
| [`.cursor/rules/stage-labs.mdc`](.cursor/rules/stage-labs.mdc) | Labs (components + content) |
| [`.cursor/rules/stage-platform.mdc`](.cursor/rules/stage-platform.mdc) | Agent BFF e APIs |

## Princípios rápidos

- **Conteúdo ≠ código:** editorial em `content/` + `messages/`; infra em `src/lib/{agent,analytics,contact}`.
- **Uma fonte por entidade:** um slug = um diretório; sem lista + detalhe duplicados.
- **Pages só orquestram:** chamam loaders em `src/content/*`; sem parágrafos longos inline.
- **Labs:** texto em `content/labs/`; comportamento em `src/components/labs/demos/` + registry.
- **Não misturar** migração de conteúdo e routing i18n no mesmo PR amplo.

## Portfolio Agent (repositório irmão)

Trabalho no serviço conversacional (KB, instruction, orquestração) vive em **`portfolio-agent`**, não neste repo.

- Roadmap: `portfolio-agent/docs/agent-roadmap.md`
- Índice: `portfolio-agent/AGENTS.md`
- BFF neste repo: `src/app/api/agent/*` + `src/lib/agent/*` (não chamar o agent direto do browser)

## Fora de escopo (salvo pedido explícito)

- Alterar o repositório `portfolio-agent` sem estar na etapa do roadmap do agent
- Introduzir banco / CMS headless
- Traduzir slugs ou renomear rotas semânticas (`/work`, `/projects`, `/labs`)
- Redesign visual não solicitado

## Stack relevante

- Next.js App Router (este repo), React 19, TypeScript, Tailwind
- Chat: browser → `POST /api/agent/chat` (BFF) → portfolio-agent (nunca chamar o agent direto do browser)
- Contato: Resend via `POST /api/contact`
