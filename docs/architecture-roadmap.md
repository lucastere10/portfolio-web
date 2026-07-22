# Portfolio — Architecture Roadmap

Documento canônico de reorganização do portfolio: arquitetura de pastas, conteúdo sem banco, internacionalização (`pt-BR` / `en`) e desenvolvimento em etapas.

**Status:** E0–E8 concluídas. Roadmap de reorganização fechado; manutenção contínua.

**Fonte relacionada:** [`AGENTS.md`](../AGENTS.md) · [`.cursor/rules/`](../.cursor/rules/)

---

## 1. Decisões travadas

| Tema | Escolha |
|------|---------|
| Default locale | `pt-BR` |
| URLs | Sem prefixo no default: `/work/...` = pt-BR; inglês = `/en/work/...` |
| Conteúdo editorial | MDX desde o início (`meta.json` + `pt-BR.mdx` / `en.mdx`) |
| UI strings (chrome) | `messages/pt-BR.json` + `messages/en.json` via **next-intl** |
| Slugs | Locale-agnostic (não traduzir o path além do prefixo `/en`) |
| APIs | Fora de locale (`/api/*`) |
| Banco de dados | Não — conteúdo em arquivos versionados |

Não reabrir essas decisões no meio de uma etapa. Se precisar mudar, atualize este documento e o `AGENTS.md` no mesmo PR.

---

## 2. Diagnóstico do estado atual

### O que funciona

- Rotas semânticas claras: `/work`, `/projects`, `/labs`
- Labs com registry de demos isolado (`src/components/labs/demo-registry.tsx` + `demos/`)
- BFF do agent (`src/app/api/agent/*` + helpers `agent-*`) e analytics como concerns separados

### Problemas

| Problema | Evidência |
|----------|-----------|
| God files de conteúdo | [`src/lib/projects.ts`](../src/lib/projects.ts) (~660 linhas), [`personal-projects.ts`](../src/lib/personal-projects.ts) (~310), [`labs.ts`](../src/lib/labs.ts) (~210) |
| Duplicação | Arrays `projects` + `caseStudies` repetem slug/name/tagline/stack |
| i18n incompleto e invertido | Conteúdo base em pt; UI e `resolveLocale(..., "en")` hardcoded; só work tem `en?` parcial |
| Conteúdo espalhado | About inline em page; [`portfolio-content.ts`](../src/lib/portfolio-content.ts); labels no [`nav.tsx`](../src/components/nav.tsx) |
| `lib/` como depósito | Agent, analytics, contact, utils e conteúdo editorial no mesmo nível |
| Nomenclatura confusa | `projects.ts` alimenta **Work**; `personal-projects.ts` alimenta **/projects** |

O padrão `campos base + en?: Partial` não escala para dois idiomas de verdade.

---

## 3. Princípios-alvo

1. **Conteúdo ≠ código** — dados editoriais fora de `lib/` de infraestrutura
2. **Uma fonte por entidade** — um case study = um pacote sob `content/<tipo>/<slug>/`
3. **Locale explícito** — UI strings (`messages/`) vs. conteúdo longo (`content/**/*.mdx`)
4. **Schema tipado** — validar no build com Zod; falhar o build se faltar locale ou campo
5. **Rotas semânticas estáveis** — manter `/work`, `/projects`, `/labs` (renomear só arquivos internos)
6. **Uma etapa por vez** — não misturar migração de conteúdo com routing i18n na mesma mudança ampla

---

## 4. Arquitetura alvo (pastas)

```text
portfolio/
├── content/                          # fonte da verdade editorial (sem DB)
│   ├── work/
│   │   └── <slug>/
│   │       ├── meta.json             # locale-agnostic
│   │       ├── pt-BR.mdx
│   │       └── en.mdx
│   ├── projects/
│   │   └── <slug>/
│   │       ├── meta.json
│   │       ├── pt-BR.mdx
│   │       └── en.mdx
│   ├── labs/
│   │   └── <slug>/
│   │       ├── meta.json             # demoKey, domain, tags, order
│   │       ├── pt-BR.mdx             # title, summary, narrative, …
│   │       └── en.mdx
│   └── pages/
│       ├── home.pt-BR.mdx / home.en.mdx
│       └── about.pt-BR.mdx / about.en.mdx
│
├── messages/                         # UI curta (nav, botões, labels)
│   ├── pt-BR.json
│   └── en.json
│
├── docs/
│   └── architecture-roadmap.md       # este arquivo
│
├── AGENTS.md
├── .cursor/rules/
│
└── src/
    ├── app/
    │   ├── [locale]/                 # next-intl; pt-BR unprefixed na URL
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   ├── work/...
    │   │   ├── projects/...
    │   │   ├── labs/...
    │   │   ├── about/...
    │   │   └── contact/...
    │   ├── api/                      # fora de [locale]
    │   ├── robots.ts
    │   └── sitemap.ts
    │
    ├── components/
    │   ├── layout/                   # nav, footer, locale-switcher
    │   ├── home/
    │   ├── work/
    │   ├── projects/
    │   ├── labs/                     # demos = código, não conteúdo
    │   ├── hero-chat/
    │   └── ui/
    │
    ├── content/                      # loaders + schemas (não o texto)
    │   ├── schemas.ts
    │   ├── work.ts
    │   ├── projects.ts
    │   ├── labs.ts
    │   └── pages.ts
    │
    ├── i18n/
    │   ├── config.ts
    │   ├── request.ts
    │   ├── routing.ts                # localePrefix: 'as-needed'
    │   └── navigation.ts
    │
    ├── lib/
    │   ├── agent/
    │   ├── analytics/
    │   ├── contact/
    │   └── utils.ts
    │
    ├── hooks/
    └── providers/
```

**Regra de ouro:** `content/` (raiz) = o que se edita como CMS; `src/content/` = como o app lê e valida.

### Separação de concerns

```text
┌─────────────────────────────────────────────┐
│  Presentation   app/[locale]/*, components  │
├─────────────────────────────────────────────┤
│  Content API    src/content/* (loaders)     │
├─────────────────────────────────────────────┤
│  Editorial      /content + /messages        │
├─────────────────────────────────────────────┤
│  Platform       lib/agent, analytics, api/* │
└─────────────────────────────────────────────┘
```

---

## 5. Modelo de dados sem banco

### Por entidade

| Arquivo | Traduz? | Exemplos de campos |
|---------|---------|-------------------|
| `meta.json` | Não | `slug`, `domain`, `stack`, `featured`, `order`, `status`, `links`, cores do hero, `demoKey` |
| `pt-BR.mdx` / `en.mdx` | Sim | `name`, `tagline`, `impact`, `context`, narrativas, listas longas |

### API de leitura (única porta de entrada)

```ts
getAllWork(locale): WorkSummary[]
getWorkBySlug(slug, locale): WorkDetail | null
getFeaturedWork(locale): WorkSummary[]
// idem: getAllProjects, getProjectBySlug, getAllLabs, getLabBySlug, getPage
```

Páginas **nunca** importam arquivos de `content/` diretamente — só via loaders em `src/content/*`.

No build, Zod valida todos os entries. Falta de `pt-BR.mdx` ou `en.mdx` (após E7) → falha o `next build`.

### Exemplo: work item

```text
content/work/ai-agents-adk/
  meta.json
  pt-BR.mdx
  en.mdx
```

**`meta.json`**

```json
{
  "slug": "ai-agents-adk",
  "domain": "AI Agents",
  "stack": ["Python", "ADK", "Vertex AI", "Cloud Run", "BigQuery", "MCP Toolbox"],
  "featured": true,
  "order": 1
}
```

**`pt-BR.mdx`** (frontmatter + corpo opcional)

```mdx
---
name: AI Agents com ADK
tagline: Agentes inteligentes integrados ao ecossistema GCP via MCP Toolbox
impact: Agentes autônomos integrando Jira, Looker e BigQuery via MCP Toolbox…
context: A equipe precisava de agentes inteligentes…
challenges:
  - Orquestrar múltiplas ferramentas…
decisions:
  - title: ADK + MCP Toolbox como camada de integração
    reasoning: O ADK do Google oferece abstrações…
tradeoffs: …
implementation: …
learnings:
  - …
metrics:
  - label: …
    value: …
---

<!-- Corpo MDX opcional para seções ricas; se o site só usa frontmatter, o body pode ficar vazio -->
```

### Exemplo de schemas (orientação para E1)

```ts
// src/content/schemas.ts (esboço)
import { z } from "zod";

export const workMetaSchema = z.object({
  slug: z.string().min(1),
  domain: z.enum([
    "AI Agents",
    "Cloud Architecture",
    "Backend Engineering",
    "Payment Systems",
    "Data Engineering",
    "Computer Vision",
  ]),
  stack: z.array(z.string()).min(1),
  featured: z.boolean().optional(),
  order: z.number().int().nonnegative(),
});

export const workLocaleSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  impact: z.string(),
  context: z.string(),
  challenges: z.array(z.string()),
  decisions: z.array(
    z.object({ title: z.string(), reasoning: z.string() }),
  ),
  tradeoffs: z.string(),
  implementation: z.string(),
  learnings: z.array(z.string()),
  metrics: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .optional(),
});
```

Ajuste campos finos na E1/E2 conforme o que as pages realmente renderizam hoje.

### Evitar

- `base + en?: Partial` (padrão atual em `projects.ts`)
- Duplicar lista resumida + case study completo
- Parágrafos longos hardcoded em `page.tsx` / `nav.tsx`
- Traduzir slugs na URL

---

## 6. Internacionalização

### Locales e URLs

| Locale | Prefixo na URL | Exemplos |
|--------|----------------|----------|
| `pt-BR` (default) | nenhum | `/`, `/work`, `/work/ai-agents-adk` |
| `en` | `/en` | `/en`, `/en/work`, `/en/work/ai-agents-adk` |

Config next-intl: `localePrefix: 'as-needed'` (default unprefixed).

### Dois buckets

| Bucket | Onde | Exemplos |
|--------|------|----------|
| UI chrome | `messages/{locale}.json` | Nav, “Try live demo”, “Context”, erros do form |
| Editorial | `content/**/{locale}.mdx` | Case studies, about, lab summaries |

### Fluxo

```text
URL  /en/work/ai-agents-adk
        │
        ▼
middleware / proxy (next-intl)     → locale = "en"
        │
        ▼
app/[locale]/work/[slug]
        │
        ├─► messages/en.json              → labels de seção, nav
        └─► content/work/.../en.mdx       → case study
```

```text
URL  /work/ai-agents-adk
        │
        ▼
mesmo pipeline                       → locale = "pt-BR"
        ├─► messages/pt-BR.json
        └─► content/work/.../pt-BR.mdx
```

### Locale switcher

Trocar só o prefixo de locale, preservando o restante do path:

- `/work/ai-agents-adk` ↔ `/en/work/ai-agents-adk`
- `/en/projects/quark` ↔ `/projects/quark`

Usar helpers de navegação do next-intl (`Link`, `usePathname`, `useRouter` de `@/i18n/navigation`).

### SEO (E8; preparar em E6)

- `<html lang="…">` por locale
- `alternates.languages` / `hreflang` em cada page
- Sitemap com URLs pt-BR (sem prefixo) e `/en/...`
- Metadata (`title`, `description`) do content do locale atual

### Fora de locale

- `/api/agent/*`, `/api/contact`, `/api/analytics`
- Assets estáticos em `public/`

---

## 7. Convenções permanentes

1. **Novo case study / project / lab** → só sob `content/<tipo>/<slug>/`; nunca em `src/lib`
2. **Novo texto de UI** → só em `messages/*.json` (ambos os locales no mesmo PR, após E6)
3. **Demos de lab** → `src/components/labs/demos/`; registrar em `demo-registry`; metadata em `content/labs/<slug>/`
4. **Infra** → `src/lib/agent|analytics|contact` — sem copy de produto
5. **Pages** → orquestram layout + chamam loaders; sem parágrafos longos inline
6. **Todo conteúdo novo** deve passar no schema Zod
7. **Slugs** estáveis e locale-agnostic
8. **Uma etapa por vez**; marcar checkboxes neste doc ao concluir

---

## 8. Etapas de desenvolvimento

Ordem obrigatória:

```text
E0 → E1 → E2 → E3 → E4 → E5 → E6 → E7 → E8
```

Não iniciar E6 (routing i18n) antes de E2–E5 terem estabilizado a camada de conteúdo (mesmo que temporariamente só com um locale nos loaders).

---

### E0 — Docs + AGENTS

**Status:** `[x]` concluída quando este doc, `AGENTS.md` e rules existirem.

**Objetivo:** material de desenvolvimento; zero mudança de runtime.

**Arquivos:**

- `docs/architecture-roadmap.md` (este)
- `AGENTS.md`
- `.cursor/rules/portfolio-architecture.mdc`
- `.cursor/rules/stage-content-mdx.mdc`
- `.cursor/rules/stage-i18n.mdc`
- `.cursor/rules/stage-labs.mdc`
- `.cursor/rules/stage-platform.mdc`

**Done quando:**

- [x] Roadmap completo com decisões, pastas, MDX, i18n unprefixed, etapas
- [x] `AGENTS.md` aponta para o roadmap e define fluxo “uma etapa por vez”
- [x] Rules Cursor cobrindo architecture / content / i18n / labs / platform

**Não fazer:** migrar conteúdo, instalar next-intl, mover rotas.

---

### E1 — Foundation (schemas, loaders, lib)

**Status:** `[x]` concluída

**Objetivo:** base tipada e `lib/` organizado, sem mudar UX.

**Feito:**

1. Adicionado `zod` (deps MDX adiadas para **E2**)
2. Criado `src/content/schemas.ts` + `locales.ts`
3. Loaders stub em `src/content/{work,projects,labs,pages}.ts` lendo god files + `.parse()` Zod
4. Reorganizado `src/lib` em `agent/`, `analytics/`, `contact/`
5. Pages/components/sitemap consomem `@/content/*`

**Done quando:**

- [x] Schemas existem e são usados pelos loaders
- [x] Nenhuma page importa `src/lib/projects.ts` / `personal-projects.ts` / `labs.ts` diretamente
- [x] `pnpm typecheck` + `pnpm test` + `pnpm build` passam
- [x] Site visualmente igual (mesma resolução locale `"en"` nos loaders)

**Não feito (conforme plano):** pasta `content/` na raiz; next-intl; deletar god files.

---

### E2 — Migrar Work → MDX

**Status:** `[x]` concluída

**Objetivo:** case studies profissionais em `content/work/<slug>/`.

**Feito:**

1. Criados `meta.json` + `pt-BR.mdx` + `en.mdx` para os 6 slugs
2. Loader `getWork*` com `gray-matter` + `fs` + `server-only` + Zod
3. Removida duplicação / deletado `src/lib/projects.ts`
4. Work page server + `WorkCatalog` client; hero recebe `workIndex` por props
5. MDX = frontmatter-only nesta etapa (sem compilador MDX)

**Done quando:**

- [x] `src/lib/projects.ts` removido
- [x] `/work` e `/work/[slug]` usam só loaders
- [x] Build valida todos os work entries

**Não feito (conforme plano):** i18n routing; migrar personal projects/labs.

---

### E3 — Migrar Personal Projects → MDX

**Status:** `[x]` concluída

**Objetivo:** `/projects` e `/projects/[slug]` via `content/projects/<slug>/`.

**Feito:**

1. Migrados `quark`, `passanota`, `drop`, `newsletter` (`meta.json` + `en.mdx` + `pt-BR.mdx` espelhando EN)
2. Demo URLs: defaults em `meta.json`; overlay via `NEXT_PUBLIC_*` no loader
3. Removido `src/lib/personal-projects.ts`
4. Loader `server-only` + Zod; hero recebe `projectIndex` por props

**Done quando:**

- [x] Listagem e detalhe iguais ao atual
- [x] Schemas cobrem `status`, `links`, `hero`, `overview`, etc.
- [x] God file removido

**Não feito (conforme plano):** tradução PT real (E7); labs; next-intl.

---

### E4 — Migrar Labs

**Status:** `[x]` concluída

**Objetivo:** metadata editorial em `content/labs/`; demos continuam em components.

**Feito:**

1. 9 labs em `content/labs/<slug>/` (`meta.json` com `demoKey` + MDX EN/pt-BR espelhado)
2. Loader `server-only` + Zod; `getLabsByDomain` ordena por `order`
3. Removido `src/lib/labs.ts`
4. `LabDetailView` usa `LAB_DEMO_REGISTRY[lab.demoKey]`
5. Demos tipam via `@/content/schemas`; hero recebe `labIndex`

**Done quando:**

- [x] Todas as labs listadas e abrindo demos
- [x] Nenhum copy de lab em `src/lib`
- [x] Insights/analytics inalterados em comportamento

**Não feito (conforme plano):** reescrever demos; next-intl.

---

### E5 — Extrair copy de pages (about, home, domains, nav)

**Status:** `[x]` concluída

**Objetivo:** zero copy editorial longa em pages/components.

**Feito:**

1. `content/pages/{home,about,contact}/{en,pt-BR}.mdx` (frontmatter-only)
2. `messages/en.json` + `messages/pt-BR.json` + helper [`src/i18n/ui.ts`](../src/i18n/ui.ts) (`getUiMessages`, locale fixo até E6)
3. Loader [`src/content/pages.ts`](../src/content/pages.ts) com `server-only`; consumers: home, about, contact, nav, footer; hero recebe `domains` por props
4. Removido `src/lib/portfolio-content.ts`

**Done quando:**

- [x] About/home/domains/contact não têm parágrafos hardcoded
- [x] Nav/footer leem de messages (via `getUiMessages`, sem next-intl routing)
- [x] `portfolio-content.ts` removido

**Não feito (conforme plano):** next-intl / `app/[locale]` (E6); traduções PT reais (E7).

---

### E6 — i18n routing (next-intl, default unprefixed)

**Status:** `[x]` concluída

**Objetivo:** URLs e layout locale-aware.

**Feito:**

1. `next-intl` com `localePrefix: 'as-needed'`, `defaultLocale: 'pt-BR'`, `localeDetection: false`
2. Site sob `src/app/[locale]/...`; APIs em `src/app/api/**`
3. Middleware + `src/i18n/{routing,navigation,request}.ts`; plugin em `next.config.ts`
4. `Link`/`usePathname` via `@/i18n/navigation`; locale switcher no nav
5. Loaders recebem `locale` da rota; `DEFAULT_CONTENT_LOCALE = "pt-BR"`
6. `<html lang={locale}>` e Open Graph locale por idioma

**Done quando:**

- [x] `/work/...` serve pt-BR; `/en/work/...` serve en
- [x] Switcher preserva path
- [x] APIs continuam em `/api/...`
- [x] Build e smoke nas rotas principais

**Não feito (conforme plano):** traduções PT reais / chrome restante em messages (E7); sitemap dual + hreflang completo (E8).

---

### E7 — Completar EN + validação estrita

**Status:** `[x]` concluída

**Objetivo:** todo entry editorial tem `pt-BR` e `en`; build falha se faltar.

**Feito:**

1. Traduzidos `pt-BR.mdx` de pages (3), projects (4) e labs (9) — work já tinha PT real
2. `messages/pt-BR.json` traduzido; namespaces `work`, `projects`, `labs`, `contactForm`, `hero`, `meta` + wiring no chrome público
3. [`scripts/validate-locales.ts`](../scripts/validate-locales.ts): dual MDX + Zod + key parity; `prebuild` + `pnpm validate:locales`
4. Teste de parity em [`src/content/locales.test.ts`](../src/content/locales.test.ts)

**Done quando:**

- [x] Navegação `/` (pt-BR) com chrome/editorial em PT; `/en/...` em EN
- [x] Build/validate quebra se faltar um `en.mdx` (ou `pt-BR.mdx`)
- [x] Checklist de conteúdo revisado (traduções PT distintas do espelho)

**Não feito (conforme plano):** i18n dos demos internos; sitemap/hreflang (E8).

---

### E8 — Cleanup + SEO

**Status:** `[x]` concluída

**Objetivo:** higiene final e SEO bilíngue.

**Feito:**

1. Helper [`src/i18n/seo.ts`](../src/i18n/seo.ts); sitemap com pares pt-BR + `/en` + `alternates.languages`
2. `alternates` (canonical + languages) no layout locale e pages de conteúdo
3. `src/proxy.ts` (Next 16); root metadata sem title/description EN órfãos; `[locale]/not-found.tsx`
4. [`README.md`](../README.md) alinhado à arquitetura; path analytics corrigido

**Done quando:**

- [x] Nenhum god file de conteúdo em `src/lib`
- [x] Sitemap e hreflang ok
- [x] README reflete a arquitetura alvo
- [x] Marcar todas as etapas anteriores como `[x]` neste doc

**Não feito (conforme plano):** refactors cosméticos; mudanças no agent backend.

---

## 9. Como adicionar conteúdo novo (após E2+)

### Novo work

1. Criar `content/work/<slug>/meta.json`
2. Criar `pt-BR.mdx` e `en.mdx` (após E7, ambos obrigatórios)
3. Rodar typecheck/build — Zod valida
4. Abrir `/work/<slug>` e `/en/work/<slug>`

### Novo personal project

Idem sob `content/projects/<slug>/`. Assets em `public/projects/<slug>/` se houver.

### Nova lab

1. `content/labs/<slug>/meta.json` com `demoKey`
2. MDX nos dois locales
3. Componente em `src/components/labs/demos/`
4. Entrada em `LAB_DEMO_REGISTRY`

---

## 10. Fora de escopo deste roadmap

- Banco de dados / CMS headless
- Alterações no repositório `portfolio-agent` (exceto contratos de API já existentes)
- Traduzir slugs ou renomear `/work` → `/trabalhos`
- Redesign visual

---

## 11. Checklist rápido do agente

Antes de qualquer PR de etapa:

1. Ler a seção da etapa em andamento neste arquivo
2. Confirmar etapa anterior marcada como done
3. Respeitar “Não fazer” da etapa
4. Ao terminar: atualizar checkboxes e **Status** da etapa aqui
5. Não commitar a menos que o usuário peça
