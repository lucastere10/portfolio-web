# UX Guidelines — Portfolio

Brief operacional para evolução de UX deste site. Não é um prompt genérico de “designer SaaS”.

## Produto

Site editorial de portfolio com:

- **Hero + chat agent** como diferencial e entrada conversacional
- **Cases / projects / labs** como prova técnica
- Conteúdo em MDX (`content/`) + UI strings em `messages/` (next-intl)
- Sem dashboard, CMS ou banco

O design atual (Syne + Geist, off-white / navy, accent gold, listas tipográficas) **agrada e deve ser preservado**. Refactors enriquecem narrativa e densidade — não trocam identidade.

## Quem e o quê

| Persona | Job em &lt;10s | Próximo passo típico |
|---------|----------------|----------------------|
| Recruiter / hiring manager técnico | Entender papel + prova de entrega | Case ou chat |
| Peer engineer | Avaliar profundidade | Lab ou case |
| Cliente / consultoria | Ver fit de domínio | Contato ou chat |

**Ação primária da home (abaixo do hero):** converter curiosidade do hero em prova (cases → labs → confiança → contato).

## Prioridades (nesta ordem)

1. Clareza
2. Hierarquia visual
3. Fluxo do usuário
4. Velocidade de interação
5. Consistência
6. Estética

Nunca inverter.

---

## Preservar

- Tipografia: `--font-syne` (display) + Geist Sans/Mono
- Tokens: background quente, dark navy, `--gold`
- Padrão de lista tipográfica nos catalogs (work), não grid de cards
- Hero + chat como estão, salvo bug/estado — **fora de escopo** deste plano
- i18n: pt-BR default, EN completo; copy editorial em `content/`, labels em `messages/`
- Arquitetura de conteúdo: loaders em `src/content/*`; pages só orquestram

## Não fazer

- Redesign visual amplo ou “parecer Linear / Notion / Vercel Dashboard”
- Grid de cards decorativos, stats em 4 caixas, ícone em tudo
- Blur/glow/gradiente sem função
- Catalogar shadcn “porque existe” (OTP, Calendar, Data Table, Charts, Menubar)
- Mexer em `portfolio-agent` sem pedido explícito
- Misturar refactor de home com routing/i18n/KB no mesmo PR amplo
- Commit sem pedido do usuário

## Anti–AI-slop (contexto portfolio)

Evitar:

- Seções clones (mesmo `label → h2 → grid` com o mesmo `py-24` quatro vezes)
- Card para cada pedaço de texto
- ASCII/pipeline decorativo que não leva a lugar nenhum
- Densidade artificial de badges/chips
- Whitespace “de template” sem hierarquia (espaço vazio ≠ ritmo)

Pergunta padrão: *existe um jeito mais rico e mais simples de mostrar isso?*

**Riqueza ≠ mais caixas.** Riqueza = prova concreta, âncoras reais, variação de ritmo, próximo passo óbvio.

## Tipografia e espaço

Hierarquia por peso, tamanho, tracking e ritmo — antes de borda, cor ou sombra.

- Whitespace é componente quando separa *perguntas* diferentes
- “Muito espaço desperdiçado” = padding repetido sem mudança de densidade ou tipo de seção
- Portfolio *usa* scroll; não cortar narrativa para “reduzir scroll” — melhorar âncoras e hierarquia

## Cards

Usar Card/caixa só quando agrupa interação ou CTA real.

Preferir: tipografia, separators, listas, grids simples, backgrounds sutis (`bg-surface`), timelines leves.

## shadcn neste projeto

Inventário útil (só se resolver fricção real):

| Componente | Uso plausível |
|------------|----------------|
| Skeleton | Loading de chat / labs |
| Tooltip | Status do agent, métricas |
| Sheet / Drawer | Chat ou filtros no mobile |
| Tabs | Modos em detalhe (se necessário) |
| Empty pattern | Catálogo filtrado vazio |

Não introduzir componentes fora dessa lista sem justificativa no PR.

## Estados

Obrigatórios onde há dados dinâmicos (chat, labs, formulário): loading, empty, error, success, partial; offline quando aplicável.

Seções estáticas da home: foco em conteúdo e links — sem over-engineering de estado.

## Microinterações

Comunicar, não decorar: hover de lista, abertura de chat, progresso de lab. Curtas; sem stagger longo em seções editoriais.

## Avaliação (por superfície)

- Informação redundante com o hero?
- Card / botão / texto demais?
- Próximo passo óbvio em &lt;5s?
- Dá para remover 20% mantendo a função?
- Parece template de IA ou portfolio editorial com prova?
- A seção responde **uma** pergunta?

Se “sim” aos problemas → redesenhar essa fatia.

## Resultado esperado

Minimalismo funcional com **densidade editorial equilibrada**, identidade própria (já existente), cuidado de UX — sem copiar chrome de app SaaS.

---

# Plano de ação — Home abaixo do hero

**Escopo:** tudo depois de `<HeroSection />` em `src/app/[locale]/page.tsx`.  
**Fora de escopo:** hero/chat, nav, footer, páginas internas (exceto links/conteúdo reutilizado).  
**Objetivo:** tornar o continuum home mais rico e narrativo, sem trocar o visual system.

## Diagnóstico (estado atual)

Quatro seções com o mesmo molde e `py-24`:

| Ordem | Seção | Pergunta que deveria responder | Problema |
|-------|--------|--------------------------------|----------|
| 1 | Domains | Em que áreas atua? | 4 mini-cards iguais; texto genérico; sem ponte para cases/labs |
| 2 | Featured | Qual a prova mais forte? | Lista boa, mas só tagline+stack; pouco “resultado” |
| 3 | Labs | Posso ver como pensa? | Copy + ASCII estático; não usa labs reais do catálogo |
| 4 | About + CTA | Por que confiar / como falar? | About fino; CTA em caixa; pouca continuidade com o acima |

Ritmo vertical monótono → sensação de template, mesmo com boa tipografia.

## Narrativa alvo

```text
Hero (já existe): quem é + conversa
    ↓
Domains: mapa de atuação com âncoras (não brochure)
    ↓
Featured: prova — cases com gancho de impacto
    ↓
Labs: “ver o sistema rodando” — teasers reais
    ↓
About strip + CTA: confiança curta → contato
```

Cada seção = uma pergunta. Variar densidade e tipo de layout entre elas.

## Princípios só desta fatia

1. **Riqueza via conteúdo real** (featured impact, labs do loader), não via mais chrome.
2. **Domains como índice**, não como cards de marketing — idealmente linkam para `/work` filtrado ou a um case/lab do domínio.
3. **Labs:** trocar (ou rebaixar) o bloco ASCII por 2–3 teasers de labs existentes (`getLabSlugs` / summaries).
4. **Featured:** enriquecer linha (ex. outcome/impacto curto) sem virar card grid; manter lista tipográfica.
5. **Ritmo:** alternar padding / `bg-surface` / tipografia; evitar quatro clones.
6. **Copy em** `content/pages/home/{pt-BR,en}.mdx` + labels em `messages/*`; estender schema Zod se precisar de campos novos.
7. **Uma fatia por PR** (abaixo).

## Fases

### H0 — Brief e inventário (docs only) ✅

- [x] Guidelines revisadas (produto, preservar, não fazer)
- [x] Diagnóstico + narrativa + fases abaixo
- [x] Labs teaser: `multi-agent-explorer`, `mcp-explorer`, `cloud-architecture-explorer`; domains com `proofHref`

### H1 — Ritmo e hierarquia ✅

**Arquivos:** `src/components/home/*`, `src/app/[locale]/page.tsx`.

- [x] Quebrar o clone `py-24` × 4: domains compacto; featured com mais ar; labs `bg-surface`; about+CTA densos
- [x] Domains: lista tipográfica numerada em 2 colunas — sem cardite
- [x] Unificar about + CTA numa faixa tipográfica + botão gold
- [x] Checklist de avaliação nas quatro seções

**Status:** done.

### H2 — Featured mais rico ✅

- [x] Reusar campo `impact` existente (sem novo schema)
- [x] Lista featured: domínio + nome + impact; stack até 3 (secundária)
- [x] Padrão lista `border-b`, não cards
- [x] EN + pt-BR (impact já bilíngue nos cases)

**Status:** done.

### H3 — Labs com prova real ✅

- [x] `featuredLabSlugs` (3) no home MDX + schema
- [x] Removido ASCII pipeline (`labsPipelineLabel` / `labsPipelineLines`)
- [x] Teasers: title + summary + link `/labs/[slug]`
- [x] CTA “Explorar Labs” permanece

**Status:** done.

### H4 — Domains como âncoras + polish ✅

- [x] `proofHref` por domain (mapa case/lab do plano)
- [x] Link “Ver prova” / “See proof”
- [x] `aboutBlurb` reescrito (GCP + agents + produção, sem ecoar hero.lead)
- [x] Checklist + fases marcadas neste doc

**Status:** done.

## Ordem de PRs

Originalmente H1→H4 sequenciais; implementação unificada no continuum home.

## Critérios de sucesso

- Visitante que scrolla o hero encontra **prova** (cases/labs) antes de um CTA genérico
- Nenhuma seção abaixo do hero é um grid de cards decorativos
- Labs na home linkam para labs reais
- Featured comunica resultado, não só stack
- Identidade visual (fontes, gold, dark/light) inalterada em essência
- pt-BR e EN cobertos

## Referência de código

- Orquestração: `src/app/[locale]/page.tsx`
- Seções: `src/components/home/{domains,featured,labs,about-cta}-section.tsx`
- Copy home: `content/pages/home/pt-BR.mdx`, `content/pages/home/en.mdx`
- Labels: `messages/pt-BR.json` → `home.*`, `messages/en.json`
- Schema: `homePageSchema` / `pageDomainSchema` em `src/content/schemas.ts`
- Featured: `getFeaturedWork` em `src/content/work.ts`
- Labs: `getLabBySlug` em `src/content/labs.ts`