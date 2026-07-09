export type PersonalProjectStatus = "live" | "in-progress" | "archived";

export interface PersonalProjectHero {
  label: string;
  accent: string;
  background: string;
}

export interface PersonalProject {
  slug: string;
  name: string;
  domain: string;
  tagline: string;
  stack: string[];
  status: PersonalProjectStatus;
  featured?: boolean;
  links: { demo?: string; github?: string; repo?: string };
  hero?: PersonalProjectHero;
  overview: string;
  highlights: string[];
  features: string[];
  technicalNotes: string;
  metrics?: { label: string; value: string }[];
  learnings?: string[];
}

const QUARK_DEMO_URL =
  process.env.NEXT_PUBLIC_QUARK_DEMO_URL ?? "https://quark.caldasdev.store/";

const PASSANOTA_DEMO_URL =
  process.env.NEXT_PUBLIC_PASSANOTA_DEMO_URL ??
  "https://passanota.caldasdev.store/";

const DROP_DEMO_URL =
  process.env.NEXT_PUBLIC_DROP_DEMO_URL ?? "https://drop.caldasdev.store/";

const NEWSLETTER_DEMO_URL =
  process.env.NEXT_PUBLIC_NEWSLETTER_DEMO_URL ?? "";

const NEWSLETTER_GITHUB_URL =
  process.env.NEXT_PUBLIC_NEWSLETTER_GITHUB_URL ?? "";

export const personalProjects: PersonalProject[] = [
  {
    slug: "quark",
    name: "Quark",
    domain: "Artificial Life & Simulation",
    tagline: "From simple rules emerges intelligence.",
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "PixiJS",
      "Zustand",
      "React Flow",
      "Recharts",
      "Turborepo",
      "Cloud Run",
    ],
    status: "live",
    featured: true,
    links: {
      demo: QUARK_DEMO_URL,
      github: "https://github.com/lucastere10/quark-web",
    },
    hero: {
      label: "Artificial Life Simulation",
      accent: "#00e5cc",
      background:
        "linear-gradient(135deg, #06060f 0%, #0a1628 50%, #06060f 100%)",
    },
    overview:
      "Quark is an interactive artificial life simulation where creatures survive with small neural networks and genetic algorithms — no scripted behaviors, no pathfinding, no hand-tuned AI. Each agent starts with a randomly initialized feed-forward network and zero knowledge of its environment. Over generations, successful agents reproduce and pass mutated brains and physical traits to offspring. You can watch evolution in real time, tweak parameters, inspect any creature's brain live, and compare stats across generations.",
    highlights: [
      "Emergent AI without ML libraries — neural network, genetic algorithm, and evolution loop built from scratch in TypeScript",
      "Dual simulation paradigms — continuous ecosystem mode and controlled generational experiments",
      "Rich interactive UX — real-time brain inspection, 3D adaptive trait space, and generational charts",
      "Production engineering — Turborepo monorepo, Docker standalone build, GCP Cloud Run CI/CD",
    ],
    features: [
      "Neuroevolution with custom MLP (14 → 8 → 4) and sigmoid activations",
      "Genetic algorithm — tournament selection, crossover, mutation, and elitism",
      "Evolving DNA traits — vision, speed, metabolism, predation drive, toxin resistance",
      "Ecosystem and generational simulation modes with predation dynamics",
      "Seven preset scenarios plus randomize — from garden ecosystems to harsh selection",
      "Climate system — humidity, temperature, rainfall, drought, and growth modifiers",
      "Brain inspector — React Flow visualization with live inputs, outputs, and activations",
      "Adaptive Space — Three.js scatter of perception × biomechanics × metabolism",
      "Live stats — population, fitness, diversity, species families over time",
      "20+ interactive sliders for evolution, environment, and creature parameters",
    ],
    technicalNotes:
      "The simulation engine lives in a pure TypeScript monorepo (`apps/web/engine/`): world tick loop, collision, sensing, predation, climate, and vegetation in a ~2000-line world module. PixiJS handles 60fps canvas rendering decoupled from React; Zustand syncs world snapshots via a requestAnimationFrame game loop with configurable simulation speed (0.25×–4×). The app ships as a Next.js standalone Docker image deployed to GCP Cloud Run.",
    metrics: [
      { label: "Network", value: "14 → 8 → 4 MLP" },
      { label: "Modes", value: "Ecosystem + Generational" },
      { label: "Scenarios", value: "7 presets" },
      { label: "Rendering", value: "PixiJS canvas" },
    ],
    learnings: [
      "Fitness design shapes emergent behavior more than network size — small networks produce surprisingly complex strategies",
      "Lab sliders as evolutionary ceilings keep the UX understandable while still allowing open-ended evolution",
      "Decoupling PixiJS rendering from React state was essential for smooth simulation at higher population counts",
    ],
  },
  {
    slug: "passanota",
    name: "PassaNota",
    domain: "FinTech / Expense Management",
    tagline: "Every receipt recorded. Every expense under control.",
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "Supabase Auth",
      "shadcn/ui",
      "Recharts",
      "FastAPI",
      "Python 3.13",
      "PostgreSQL",
      "pgvector",
      "OpenCV",
      "Cloud Run",
      "Cloud Tasks",
    ],
    status: "live",
    featured: true,
    links: {
      demo: PASSANOTA_DEMO_URL,
      github: "https://github.com/lucastere10/passanota-web",
      repo: "https://github.com/lucastere10/passanota-api",
    },
    hero: {
      label: "Cost control via fiscal invoices",
      accent: "#14b8a6",
      background:
        "linear-gradient(135deg, #0a0f0e 0%, #0f1a18 50%, #0a0f0e 100%)",
    },
    overview:
      "PassaNota is a B2B expense-control platform for Brazilian businesses. Teams photograph fiscal receipts on desktop or paired mobile devices; a vision LLM pipeline extracts structured data — vendor, line items, totals, and dates — without manual entry. Managers get dashboards with spend trends, category breakdowns, and top products, while operators capture receipts in the field. The system supports multi-company tenancy, role-based access, and platform-level admin tooling, deployed on GCP Cloud Run with Supabase auth and service-to-service IAM between frontend and API.",
    highlights: [
      "End-to-end AI receipt pipeline — OpenCV document preprocessing plus multi-provider vision LLM extraction",
      "Production BFF architecture — Next.js proxy with Cloud Run IAM, Supabase JWT forwarding, and multi-tenant headers",
      "Multi-tenant SaaS design — gestor/operador roles, QR + PIN device pairing, platform admin overview",
      "Split architecture — Next.js frontend (`passanota-web`) and FastAPI backend (`passanota-api`) on GCP",
    ],
    features: [
      "AI-powered receipt capture via file upload or live camera with document detection",
      "Async background processing with capture status tracking via Cloud Tasks",
      "Spend dashboard — totals, average ticket, period comparison, category and emitter charts",
      "Paginated invoice list with detailed line-item views and AI confidence badges",
      "Manual item editing and categorization when extraction needs correction",
      "Semantic product search over invoice line items using pgvector embeddings",
      "Multi-company support with empresa switcher and isolated tenant data",
      "Mobile device pairing (QR code + PIN) for field operators without full login",
      "Passwordless Supabase magic-link authentication with profile completion flow",
      "Platform admin panel — company metrics, usage tracking, and tenant management",
    ],
    technicalNotes:
      "The Next.js app routes all API calls through a BFF proxy at `/api/proxy/*`, forwarding the Supabase Bearer token, `X-Empresa-Id`, and device tokens. In production, the proxy swaps the user JWT for a Cloud Run IAM ID token to reach the private FastAPI service. The API runs an async pipeline: store photo in Supabase Storage, enqueue Cloud Tasks, OpenCV preprocess, vision LLM extract, persist items, then SQL-normalize categories with keyword and embedding refinement. Semantic search uses pgvector HNSW indexes on multilingual sentence embeddings.",
    metrics: [
      { label: "Stack", value: "Next.js 16 + FastAPI" },
      { label: "AI pipeline", value: "Vision LLM + OpenCV" },
      { label: "Search", value: "pgvector HNSW" },
      { label: "Deploy", value: "GCP Cloud Run" },
    ],
    learnings: [
      "Vision LLMs handle messy thermal receipts better than template OCR — preprocessing with OpenCV still matters for extraction quality",
      "A BFF layer with Cloud Run IAM is the cleanest way to keep the API private while forwarding Supabase user context",
      "Hybrid categorization — LLM first pass plus SQL keyword/embedding refinement — keeps taxonomy consistent across tenants",
    ],
  },
  {
    slug: "drop",
    name: "Drop",
    domain: "Data Analytics / AI",
    tagline: "Clean data. Clear insights. Immediate action.",
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "shadcn/ui",
      "Recharts",
      "react-grid-layout",
      "Django 5.2",
      "DRF",
      "pandas",
      "PostgreSQL",
      "Google ADK",
      "Gemini",
      "OpenAI",
      "Cloud Tasks",
      "GCS",
      "Cloud Run",
    ],
    status: "live",
    featured: true,
    links: {
      demo: DROP_DEMO_URL,
      github: "https://github.com/lucastere10/drop-frontend",
      repo: "https://github.com/lucastere10/drop-api",
    },
    hero: {
      label: "AI-powered data analysis",
      accent: "#6366f1",
      background:
        "linear-gradient(135deg, #0a0a12 0%, #12102a 50%, #0a0a12 100%)",
    },
    overview:
      "Drop is a self-serve data analysis platform that turns raw spreadsheets into actionable insights in minutes. Users drag-and-drop CSV, XLSX, or JSON files and receive instant statistical profiling — schema detection, missing values, correlations, outlier analysis, and a letter-grade data quality score. AI generates executive summaries, prioritized insights, ML use-case recommendations, and auto-built charts on a draggable dashboard grid. A floating chat assistant lets users ask natural-language questions about their dataset. Anonymous trials expire in 24 hours; authenticated users get persistent history, sharing, favorites, and a credit-based quota system across Free, Paid, and Enterprise tiers.",
    highlights: [
      "Zero-to-insight upload flow with sessionStorage handoff for instant results-page rendering",
      "AI Discovery suite — executive summaries, prioritized insights, and ML recommendations via async Cloud Tasks",
      "Smart chart dashboard — drag-and-resize grid with Recharts and layout persistence",
      "Split architecture — independent Next.js frontend and Django API repos, each with Cloud Build → Cloud Run pipeline",
    ],
    features: [
      "Drag-and-drop upload for CSV, XLSX, and JSON with instant statistical profiling",
      "Data quality scoring with S–F grades and component breakdown (completeness, uniqueness, consistency)",
      "AI insights — executive summaries, ML recommendations, and prioritized findings with quality alerts",
      "Auto-generated smart charts (bar, line, pie, scatter) on a responsive dashboard grid",
      "Conversational data exploration — floating chat with suggested questions and multi-turn history",
      "Multi-channel auth — email/password, Google, GitHub, magic link, and QR-code mobile login",
      "Saved analyses with search, favorites, public/private toggle, and shareable links",
      "Freemium credit model — Anonymous, Free, Paid, and Enterprise tiers with usage tracking",
      "Five curated sample datasets for exploration without uploading files",
      "Async task polling (HTTP 202 + Cloud Tasks) with exponential backoff for long-running AI jobs",
    ],
    technicalNotes:
      "The Next.js frontend uses a typed Axios service layer; upload responses are cached in sessionStorage so the results page renders immediately. `NEXT_PUBLIC_API_URL` is baked in at Docker build time for standalone Cloud Run deployment. The Django REST API runs pandas-based profiling synchronously on upload, then offloads AI work to Cloud Tasks workers (`ai_insights`, `ai_chat`, `chart_generation`). Clients poll `/api/tasks/{id}/` until completion. Files live in Google Cloud Storage with signed URLs; auth uses JWT with refresh rotation across five login channels.",
    metrics: [
      { label: "Stack", value: "Next.js 16 + Django 5.2" },
      { label: "Formats", value: "CSV, XLSX, JSON" },
      { label: "AI", value: "Gemini ADK + OpenAI" },
      { label: "Deploy", value: "GCP Cloud Run" },
    ],
    learnings: [
      "SessionStorage as an upload cache eliminates the results-page loading flash and handles React Strict Mode cleanly",
      "Async AI via Cloud Tasks (202 + poll) keeps the UI responsive and avoids Cloud Run request timeouts",
      "Build-time `NEXT_PUBLIC_*` injection is required for Next.js standalone output on Cloud Run — runtime env alone is not enough",
    ],
  },
  {
    slug: "newsletter",
    name: "KnowledgeHub",
    domain: "Personalized AI & Technology Intelligence",
    tagline: "Personalized AI & technology intelligence, delivered weekly.",
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "shadcn/ui",
      "Prisma",
      "PostgreSQL",
      "Redis",
      "Python",
      "OpenAI",
      "Resend",
      "Turborepo",
      "Docker",
    ],
    status: "in-progress",
    featured: true,
    links: {
      ...(NEWSLETTER_DEMO_URL ? { demo: NEWSLETTER_DEMO_URL } : {}),
      ...(NEWSLETTER_GITHUB_URL ? { github: NEWSLETTER_GITHUB_URL } : {}),
    },
    hero: {
      label: "Intelligence Pipeline",
      accent: "#b45309",
      background:
        "linear-gradient(135deg, #0c0a08 0%, #1a1208 50%, #0c0a08 100%)",
    },
    overview:
      "KnowledgeHub is a personalized technology intelligence platform — not simply a newsletter. A Python collector worker continuously ingests articles from curated RSS sources and scrapers, enriches them with AI (summaries, topics, keywords, embeddings, quality scores), and stores them in a shared PostgreSQL database. A composite recommendation engine ranks content per user from topic weights, engagement, freshness, and diversity — without relying solely on LLM prompts. Users receive beautifully formatted, tracked weekly editions via email.",
    highlights: [
      "Python collector worker decoupled from Next.js, sharing a Prisma-managed PostgreSQL schema",
      "5-signal composite recommendation engine (quality, affinity, engagement, freshness, diversity) with Redis caching",
      "Offline-capable ingestion pipeline with OpenAI enrichment and heuristic fallbacks when keys are absent",
      "Full admin dashboard for sources, articles, worker runs, newsletters, and analytics",
    ],
    features: [
      "SaaS marketing landing with sample newsletter preview and onboarding flow",
      "Magic-link authentication and weighted topic preferences across 11 categories",
      "RSS and scraper collection with AI enrichment, embeddings, and global quality scoring",
      "Personalized newsletter generation with HTML rendering and click/open tracking",
      "Composite ranking with greedy diversity selection and 5-minute Redis cache TTL",
      "Admin console — users, news sources, articles, newsletter editions, worker executions",
      "Domain-driven modules with typed domain events for future ML and search features",
      "Docker Compose local stack with PostgreSQL 16 and Redis 7",
      "Graceful degradation — Redis, OpenAI, and Resend are optional for local development",
      "Turborepo monorepo with shared scoring primitives across TypeScript and Python",
    ],
    technicalNotes:
      "Built as a Turborepo monorepo: `apps/web` (Next.js 16 App Router with domain modules for auth, preferences, recommendation, newsletter, analytics, admin), `workers/collector` (Python feedparser + BeautifulSoup pipeline writing via SQLAlchemy to the same Prisma schema), and packages for database, shared scoring/topics/events, and shadcn/ui. The recommendation engine blends five weighted signals in TypeScript; the collector enriches and embeds offline when OpenAI is unavailable. Email delivery uses Resend with open-pixel and click tracking feeding engagement signals back into ranking.",
    metrics: [
      { label: "Workspaces", value: "7" },
      { label: "Topic categories", value: "11" },
      { label: "RSS sources", value: "5 seeded" },
      { label: "Ranking signals", value: "5" },
    ],
    learnings: [
      "Composite scoring beats prompt-only personalization for explainability, cost control, and tunable ranking",
      "Optional Redis, OpenAI, and Resend degrade gracefully — the full stack runs locally without external services",
      "Shared scoring primitives in `@workspace/shared` keep the web app and Python worker conceptually aligned",
    ],
  },
];

export function getPersonalProjectBySlug(
  slug: string
): PersonalProject | undefined {
  return personalProjects.find((p) => p.slug === slug);
}

export function getFeaturedPersonalProjects(): PersonalProject[] {
  return personalProjects.filter((p) => p.featured);
}
