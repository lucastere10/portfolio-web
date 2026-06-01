export type Domain =
  | "AI Agents"
  | "Cloud Architecture"
  | "Backend Engineering"
  | "Payment Systems"
  | "Data Engineering"
  | "Computer Vision";

export interface Project {
  slug: string;
  name: string;
  domain: Domain;
  tagline: string;
  stack: string[];
  impact: string;
  featured?: boolean;
  en?: { name?: string; tagline?: string; impact?: string };
}

interface CaseStudyEN {
  name?: string;
  tagline?: string;
  impact?: string;
  context?: string;
  challenges?: string[];
  decisions?: { title: string; reasoning: string }[];
  tradeoffs?: string;
  implementation?: string;
  learnings?: string[];
  metrics?: { label: string; value: string }[];
}

export interface CaseStudy extends Project {
  context: string;
  challenges: string[];
  decisions: { title: string; reasoning: string }[];
  tradeoffs: string;
  implementation: string;
  learnings: string[];
  metrics?: { label: string; value: string }[];
  en?: CaseStudyEN;
}

export type ResolvedProject = Omit<CaseStudy, "en">;

export function resolveLocale(cs: CaseStudy, locale: string): ResolvedProject {
  if (locale === "en" && cs.en) {
    const e = cs.en;
    return {
      slug: cs.slug,
      name: e.name ?? cs.name,
      domain: cs.domain,
      tagline: e.tagline ?? cs.tagline,
      impact: e.impact ?? cs.impact,
      stack: cs.stack,
      featured: cs.featured,
      context: e.context ?? cs.context,
      challenges: e.challenges ?? cs.challenges,
      decisions: e.decisions ?? cs.decisions,
      tradeoffs: e.tradeoffs ?? cs.tradeoffs,
      implementation: e.implementation ?? cs.implementation,
      learnings: e.learnings ?? cs.learnings,
      metrics: e.metrics ?? cs.metrics,
    };
  }
  return {
    slug: cs.slug,
    name: cs.name,
    domain: cs.domain,
    tagline: cs.tagline,
    impact: cs.impact,
    stack: cs.stack,
    featured: cs.featured,
    context: cs.context,
    challenges: cs.challenges,
    decisions: cs.decisions,
    tradeoffs: cs.tradeoffs,
    implementation: cs.implementation,
    learnings: cs.learnings,
    metrics: cs.metrics,
  };
}

export const projects: Project[] = [
  {
    slug: "ai-agents-adk",
    name: "AI Agents com ADK",
    domain: "AI Agents",
    tagline:
      "Agentes inteligentes integrados ao ecossistema GCP via MCP Toolbox",
    impact:
      "Agentes autônomos integrando Jira, Looker e BigQuery via MCP Toolbox, implantados no Cloud Run com Vertex AI.",
    stack: [
      "Python",
      "ADK",
      "Vertex AI",
      "Cloud Run",
      "BigQuery",
      "MCP Toolbox",
    ],
    featured: true,
  },
  {
    slug: "payment-integration-platform",
    name: "Plataforma de Integração de Pagamentos",
    domain: "Payment Systems",
    tagline:
      "Stripe event-driven: checkout, assinaturas e gestão de ciclo de vida",
    impact:
      "Integração completa com Stripe — webhooks, checkout automático, gestão de assinaturas e recuperação de pagamentos falhos.",
    stack: ["Python", "Stripe", "Webhooks", "PostgreSQL", "FastAPI"],
    featured: true,
  },
  {
    slug: "gpos-payment-system",
    name: "Sistema de Pagamento GPOS",
    domain: "Payment Systems",
    tagline: "Backend .NET/C# para PIX e cartões com autenticação mTLS",
    impact:
      "Sistema completo de pagamentos em .NET/C# com PIX, cartões, mTLS e registro remoto de terminais — eliminando o envio físico de dispositivos.",
    stack: [".NET", "C#", "PIX", "mTLS", "REST APIs"],
    featured: true,
  },
  {
    slug: "transactional-email-microservice",
    name: "Microsserviço de Email Transacional",
    domain: "Backend Engineering",
    tagline: "Microsserviço desacoplado baseado em filas para envio de emails",
    impact:
      "Microsserviço desacoplado com fila de mensagens, reutilizado em múltiplos produtos sem alteração de código.",
    stack: ["Python", "RabbitMQ", "SMTP", "Docker", "FastAPI"],
    featured: false,
  },
  {
    slug: "computer-vision-analytics",
    name: "Analytics de Visão Computacional",
    domain: "Computer Vision",
    tagline:
      "Contagem de pessoas e tempo de permanência para métricas operacionais",
    impact:
      "Pipeline de visão computacional para contagem de pessoas e análise de tempo de permanência gerando métricas operacionais em tempo real.",
    stack: ["Python", "OpenCV", "YOLO", "PostgreSQL", "FastAPI"],
    featured: false,
  },
  {
    slug: "service-licensing-system",
    name: "Sistema de Licenciamento de Serviços",
    domain: "Backend Engineering",
    tagline: "Ativação por token, gestão de permissões e CRUDs administrativos",
    impact:
      "Sistema de licenciamento com ativação por token, controle de permissões granular e painel administrativo completo.",
    stack: ["C#", ".NET", "PostgreSQL", "JWT", "REST APIs"],
    featured: false,
  },
];

export const caseStudies: CaseStudy[] = [
  {
    slug: "ai-agents-adk",
    name: "AI Agents com ADK",
    domain: "AI Agents",
    tagline:
      "Agentes inteligentes integrados ao ecossistema GCP via MCP Toolbox",
    impact:
      "Agentes autônomos integrando Jira, Looker e BigQuery via MCP Toolbox, implantados no Cloud Run com Vertex AI.",
    stack: [
      "Python",
      "ADK",
      "Vertex AI",
      "Cloud Run",
      "BigQuery",
      "MCP Toolbox",
    ],
    featured: true,
    context:
      "A equipe precisava de agentes inteligentes que pudessem consultar dados de negócio em Jira, Looker e BigQuery de forma autônoma, sem expor APIs internas diretamente ao modelo.",
    challenges: [
      "Orquestrar múltiplas ferramentas (Jira, Looker, BigQuery) de forma confiável sem que o agente entrasse em loops",
      "Garantir segurança no acesso a dados sensíveis via MCP Toolbox no ambiente GCP",
      "Gerenciar contexto e memória em conversas longas sem ultrapassar limites de tokens",
      "Deploy no Cloud Run com cold start aceitável para uso interativo",
    ],
    decisions: [
      {
        title: "ADK + MCP Toolbox como camada de integração",
        reasoning:
          "O ADK (Agent Development Kit) do Google oferece abstrações nativas para orquestração de agentes no ecossistema Vertex AI. O MCP Toolbox permite expor ferramentas de negócio de forma padronizada sem acoplamento direto ao modelo.",
      },
      {
        title: "Cloud Run para deploy serverless",
        reasoning:
          "Escala zero para instruções infrequentes, integração nativa com Vertex AI e IAM do GCP, sem overhead de gestão de infraestrutura.",
      },
      {
        title: "BigQuery como fonte primária de dados analíticos",
        reasoning:
          "Elimina a necessidade de uma camada de cache separada — o agente consulta diretamente BigQuery via SQL gerado, com resultados paginados para caber no contexto.",
      },
    ],
    tradeoffs:
      "O MCP Toolbox adiciona uma camada de indireção que aumenta a latência em ~200ms por chamada de ferramenta. Aceitável para casos de uso conversacionais, mas não para pipelines de alta frequência.",
    implementation:
      "Cada agente é um Cloud Run service com configuração de ferramentas em YAML. O MCP Toolbox gerencia autenticação e exposição das APIs de Jira e Looker. O orquestrador em Python usa o ADK para decidir qual ferramenta invocar com base no contexto da conversa.",
    learnings: [
      "Descrever ferramentas com exemplos concretos de quando não usá-las reduz chamadas desnecessárias em ~40%",
      "Separar agentes por domínio (dados vs. projeto vs. relatório) é mais robusto do que um agente genérico com muitas ferramentas",
      "Logs estruturados de cada decisão do agente são essenciais para debugging em produção",
    ],
    metrics: [
      { label: "Ferramentas integradas", value: "3" },
      { label: "Latência média por turno", value: "~1.8s" },
      { label: "Plataforma de deploy", value: "Cloud Run / GCP" },
    ],
    en: {
      name: "AI Agents with ADK",
      tagline:
        "Intelligent agents integrated into the GCP ecosystem via MCP Toolbox",
      impact:
        "Autonomous agents integrating Jira, Looker, and BigQuery via MCP Toolbox, deployed on Cloud Run with Vertex AI.",
      context:
        "The team needed intelligent agents that could autonomously query business data in Jira, Looker, and BigQuery, without directly exposing internal APIs to the model.",
      challenges: [
        "Orchestrating multiple tools (Jira, Looker, BigQuery) reliably without the agent entering loops",
        "Ensuring secure access to sensitive data via MCP Toolbox in the GCP environment",
        "Managing context and memory in long conversations without exceeding token limits",
        "Deploying to Cloud Run with acceptable cold start times for interactive use",
      ],
      decisions: [
        {
          title: "ADK + MCP Toolbox as the integration layer",
          reasoning:
            "Google's ADK (Agent Development Kit) offers native abstractions for orchestrating agents in the Vertex AI ecosystem. MCP Toolbox allows exposing business tools in a standardized way without direct model coupling.",
        },
        {
          title: "Cloud Run for serverless deployment",
          reasoning:
            "Scales to zero for infrequent invocations, native integration with Vertex AI and GCP IAM, no infrastructure management overhead.",
        },
        {
          title: "BigQuery as the primary analytical data source",
          reasoning:
            "Eliminates the need for a separate cache layer — the agent queries BigQuery directly via generated SQL, with paginated results to fit within context.",
        },
      ],
      tradeoffs:
        "MCP Toolbox adds an indirection layer that increases latency by ~200ms per tool call. Acceptable for conversational use cases, but not for high-frequency pipelines.",
      implementation:
        "Each agent is a Cloud Run service with tool configuration in YAML. MCP Toolbox manages authentication and API exposure for Jira and Looker. The Python orchestrator uses ADK to decide which tool to invoke based on conversation context.",
      learnings: [
        "Describing tools with concrete examples of when NOT to use them reduces unnecessary calls by ~40%",
        "Separating agents by domain (data vs. project vs. report) is more robust than a generic agent with many tools",
        "Structured logs of each agent decision are essential for debugging in production",
      ],
      metrics: [
        { label: "Integrated tools", value: "3" },
        { label: "Avg latency per turn", value: "~1.8s" },
        { label: "Deployment platform", value: "Cloud Run / GCP" },
      ],
    },
  },
  {
    slug: "payment-integration-platform",
    name: "Plataforma de Integração de Pagamentos",
    domain: "Payment Systems",
    tagline:
      "Stripe event-driven: checkout, assinaturas e gestão de ciclo de vida",
    impact:
      "Integração completa com Stripe — webhooks, checkout automático, gestão de assinaturas e recuperação de pagamentos falhos.",
    stack: ["Python", "Stripe", "Webhooks", "PostgreSQL", "FastAPI"],
    featured: true,
    context:
      "O produto precisava suportar pagamentos recorrentes com múltiplos planos, upgrades/downgrades em tempo real e recuperação automática de inadimplência.",
    challenges: [
      "Garantir idempotência no processamento de webhooks Stripe (eventos podem chegar duplicados)",
      "Sincronizar estado de assinatura entre Stripe e o banco de dados local sem inconsistência",
      "Gerenciar transições de plano (upgrade/downgrade) com pró-rata correto",
      "Recuperar pagamentos falhos com retry inteligente sem spam ao cliente",
    ],
    decisions: [
      {
        title: "Event-driven via webhooks com idempotência",
        reasoning:
          "Cada evento Stripe é processado exatamente uma vez usando o event ID como chave de idempotência no banco. Garante consistência mesmo com retentativas do Stripe.",
      },
      {
        title: "Estado local como fonte de verdade para a aplicação",
        reasoning:
          "A aplicação mantém seu próprio modelo de assinatura sincronizado via webhooks. Isso permite consultas rápidas sem dependência de latência da API Stripe.",
      },
      {
        title: "Checkout Session vs. Payment Intent",
        reasoning:
          "Checkout Session para fluxos novos (UI hospedada pelo Stripe, menor surface de PCI). Payment Intent apenas para renovações automáticas já autorizadas.",
      },
    ],
    tradeoffs:
      "Manter estado local duplicado requer reconciliação periódica com a API Stripe para detectar deriva. Um job diário de reconciliação foi suficiente para o volume atual.",
    implementation:
      "FastAPI recebe webhooks Stripe com verificação de assinatura HMAC. Cada tipo de evento tem um handler dedicado. Estado de assinatura salvo em PostgreSQL com enum de status (active, past_due, canceled, trialing).",
    learnings: [
      "Testar webhooks localmente com Stripe CLI antes de produzir economiza horas de debugging",
      "Logar o payload completo do evento (truncado) facilita auditoria de disputas de pagamento",
      "Implementar webhook delivery log permite reprocessar eventos manualmente quando necessário",
    ],
    metrics: [
      { label: "Tipos de evento tratados", value: "12" },
      { label: "Taxa de sucesso no checkout", value: ">98%" },
      { label: "Recuperação de inadimplência", value: "Automática" },
    ],
    en: {
      name: "Payment Integration Platform",
      tagline:
        "Stripe event-driven: checkout, subscriptions, and lifecycle management",
      impact:
        "Full Stripe integration — webhooks, automated checkout, subscription management, and failed payment recovery.",
      context:
        "The product needed to support recurring payments with multiple plans, real-time upgrades/downgrades, and automatic delinquency recovery.",
      challenges: [
        "Ensuring idempotency in Stripe webhook processing (events can arrive duplicated)",
        "Synchronizing subscription state between Stripe and the local database without inconsistency",
        "Managing plan transitions (upgrade/downgrade) with correct proration",
        "Recovering failed payments with intelligent retry without spamming the customer",
      ],
      decisions: [
        {
          title: "Event-driven via webhooks with idempotency",
          reasoning:
            "Each Stripe event is processed exactly once using the event ID as an idempotency key in the database. Guarantees consistency even with Stripe retries.",
        },
        {
          title: "Local state as the source of truth for the application",
          reasoning:
            "The application maintains its own subscription model synchronized via webhooks. This allows fast queries without dependence on Stripe API latency.",
        },
        {
          title: "Checkout Session vs. Payment Intent",
          reasoning:
            "Checkout Session for new flows (UI hosted by Stripe, smaller PCI surface). Payment Intent only for automatic renewals already authorized.",
        },
      ],
      tradeoffs:
        "Maintaining a local duplicate state requires periodic reconciliation with the Stripe API to detect drift. A daily reconciliation job was sufficient for the current volume.",
      implementation:
        "FastAPI receives Stripe webhooks with HMAC signature verification. Each event type has a dedicated handler. Subscription state saved in PostgreSQL with status enum (active, past_due, canceled, trialing).",
      learnings: [
        "Testing webhooks locally with Stripe CLI before production saves hours of debugging",
        "Logging the full event payload (truncated) makes payment dispute auditing easier",
        "Implementing a webhook delivery log allows manual reprocessing when needed",
      ],
      metrics: [
        { label: "Event types handled", value: "12" },
        { label: "Checkout success rate", value: ">98%" },
        { label: "Delinquency recovery", value: "Automatic" },
      ],
    },
  },
  {
    slug: "gpos-payment-system",
    name: "Sistema de Pagamento GPOS",
    domain: "Payment Systems",
    tagline: "Backend .NET/C# para PIX e cartões com autenticação mTLS",
    impact:
      "Sistema completo de pagamentos em .NET/C# com PIX, cartões, mTLS e registro remoto de terminais — eliminando o envio físico de dispositivos.",
    stack: [".NET", "C#", "PIX", "mTLS", "REST APIs"],
    featured: true,
    context:
      "O produto GPOS precisava de um backend robusto para processar pagamentos via PIX e cartões, com autenticação mútua entre terminais e servidor, e registro remoto de novos dispositivos.",
    challenges: [
      "Implementar mTLS para autenticação mútua entre terminais físicos e o servidor",
      "Garantir conformidade com as regras do BACEN para transações PIX",
      "Eliminar o processo manual de envio físico de dispositivos para registro",
      "Manter consistência transacional em cenários de conexão instável nos terminais",
    ],
    decisions: [
      {
        title: "mTLS para autenticação bilateral terminal-servidor",
        reasoning:
          "Terminais físicos não podem depender de credenciais rotacionáveis por usuário. Certificados cliente instalados no terminal garantem identidade do dispositivo sem intervenção humana.",
      },
      {
        title: "Registro remoto de terminais",
        reasoning:
          "O processo anterior exigia envio físico do dispositivo para configuração. O novo fluxo permite registro via API autenticada durante o onboarding, reduzindo custo logístico significativamente.",
      },
      {
        title: ".NET como runtime principal",
        reasoning:
          "Stack já estabelecida na empresa com bibliotecas maduras para PIX (BACEN SPI) e integrações com bandeiras de cartão via ISO 8583.",
      },
    ],
    tradeoffs:
      "mTLS adiciona complexidade na gestão do ciclo de vida de certificados (expiração, revoção). Foi necessário implementar um processo de renovação automática antes do vencimento.",
    implementation:
      ".NET 8 com ASP.NET Core, configuração de Kestrel para mTLS com validação de CA privada. PIX implementado seguindo especificação BACEN SPI. Registro de terminais via endpoint autenticado com múltiplos fatores de verificação.",
    learnings: [
      "Documentação do BACEN para PIX é extensa mas precisa — seguir à risca evita rejeitações na integração",
      "Implementar circuit breaker nas chamadas ao PSP evita cascata de falhas em indisponibilidade do banco",
      "Logs de transação imutáveis são obrigatórios para auditoria — não use UPDATE em registros de pagamento",
    ],
    metrics: [
      { label: "Métodos de pagamento", value: "PIX + Cartões" },
      { label: "Autenticação", value: "mTLS" },
      { label: "Registro de terminais", value: "100% remoto" },
    ],
    en: {
      name: "GPOS Payment System",
      tagline: ".NET/C# backend for PIX and cards with mTLS authentication",
      impact:
        "Complete .NET/C# payment system with PIX, cards, mTLS, and remote terminal registration — eliminating the need to ship physical devices.",
      context:
        "The GPOS product needed a robust backend to process payments via PIX and cards, with mutual authentication between terminals and the server, and remote registration of new devices.",
      challenges: [
        "Implementing mTLS for mutual authentication between physical terminals and the server",
        "Ensuring compliance with BACEN rules for PIX transactions",
        "Eliminating the manual physical device shipping process for registration",
        "Maintaining transactional consistency in unstable connection scenarios on terminals",
      ],
      decisions: [
        {
          title: "mTLS for bilateral terminal-server authentication",
          reasoning:
            "Physical terminals cannot depend on user-rotatable credentials. Client certificates installed on the terminal ensure device identity without human intervention.",
        },
        {
          title: "Remote terminal registration",
          reasoning:
            "The previous process required physically sending the device for configuration. The new flow allows registration via authenticated API during onboarding, significantly reducing logistics costs.",
        },
        {
          title: ".NET as the primary runtime",
          reasoning:
            "Already established stack at the company with mature libraries for PIX (BACEN SPI) and card brand integrations via ISO 8583.",
        },
      ],
      tradeoffs:
        "mTLS adds complexity to certificate lifecycle management (expiration, revocation). It was necessary to implement an automatic renewal process before expiry.",
      implementation:
        ".NET 8 with ASP.NET Core, Kestrel configuration for mTLS with private CA validation. PIX implemented following the BACEN SPI specification. Terminal registration via authenticated endpoint with multiple verification factors.",
      learnings: [
        "BACEN's PIX documentation is extensive but precise — following it exactly avoids rejections during integration",
        "Implementing a circuit breaker on PSP calls prevents cascade failures during bank unavailability",
        "Immutable transaction logs are mandatory for auditing — never UPDATE payment records",
      ],
      metrics: [
        { label: "Payment methods", value: "PIX + Cards" },
        { label: "Authentication", value: "mTLS" },
        { label: "Terminal registration", value: "100% remote" },
      ],
    },
  },
  {
    slug: "transactional-email-microservice",
    name: "Microsserviço de Email Transacional",
    domain: "Backend Engineering",
    tagline: "Microsserviço desacoplado baseado em filas para envio de emails",
    impact:
      "Microsserviço desacoplado com fila de mensagens, reutilizado em múltiplos produtos sem alteração de código.",
    stack: ["Python", "RabbitMQ", "SMTP", "Docker", "FastAPI"],
    featured: false,
    context:
      "Vários produtos da empresa precisavam enviar emails transacionais (confirmação, notificação, alertas). Cada produto tinha sua própria implementação duplicada.",
    challenges: [
      "Desacoplar completamente o envio de email da lógica de negócio dos produtos",
      "Garantir entrega confiável mesmo quando o provider SMTP está indisponível",
      "Suportar templates dinâmicos sem requerer deploy para cada mudança de conteúido",
    ],
    decisions: [
      {
        title: "Fila de mensagens como interface pública",
        reasoning:
          "Produtores publicam na fila e não são afetados por indisponibilidade do SMTP. O consumidor processa na velocidade do provider, com retry automático.",
      },
      {
        title: "Templates armazenados separadamente",
        reasoning:
          "Templates em banco de dados permitem alteração de conteúido sem deploy. Produtores enviam apenas o payload de dados.",
      },
    ],
    tradeoffs:
      "Delivery assíncrono significa que o remetente não sabe imediatamente se o email foi enviado. Aceitável para emails transacionais onde latência de segundos é tolerada.",
    implementation:
      "Consumer Python lendo de fila RabbitMQ, renderizando templates Jinja2, enviando via SMTP com retry exponencial. Dead letter queue para falhas persistentes com alerta operacional.",
    learnings: [
      "Dead letter queue é essencial — sem ela emails falhos são perdidos silenciosamente",
      "Rate limiting no consumer evita ban do provider SMTP por envio em ráfagas",
    ],
    en: {
      name: "Transactional Email Microservice",
      tagline: "Queue-based decoupled microservice for email delivery",
      impact:
        "Decoupled microservice with message queue, reused across multiple products without code changes.",
      context:
        "Multiple company products needed to send transactional emails (confirmation, notification, alerts). Each product had its own duplicated implementation.",
      challenges: [
        "Completely decoupling email sending from product business logic",
        "Ensuring reliable delivery even when the SMTP provider is unavailable",
        "Supporting dynamic templates without requiring a deployment for each content change",
      ],
      decisions: [
        {
          title: "Message queue as the public interface",
          reasoning:
            "Producers publish to the queue and are unaffected by SMTP unavailability. The consumer processes at the provider's rate, with automatic retry.",
        },
        {
          title: "Templates stored separately",
          reasoning:
            "Templates in the database allow content changes without deployment. Producers send only the data payload.",
        },
      ],
      tradeoffs:
        "Asynchronous delivery means the sender doesn't immediately know if the email was sent. Acceptable for transactional emails where seconds of latency is tolerated.",
      implementation:
        "Python consumer reading from RabbitMQ queue, rendering Jinja2 templates, sending via SMTP with exponential retry. Dead letter queue for persistent failures with operational alerting.",
      learnings: [
        "Dead letter queue is essential — without it, failed emails are silently lost",
        "Rate limiting on the consumer prevents SMTP provider bans from burst sending",
      ],
    },
  },
  {
    slug: "computer-vision-analytics",
    name: "Analytics de Visão Computacional",
    domain: "Computer Vision",
    tagline:
      "Contagem de pessoas e tempo de permanência para métricas operacionais",
    impact:
      "Pipeline de visão computacional para contagem de pessoas e análise de tempo de permanência gerando métricas operacionais em tempo real.",
    stack: ["Python", "OpenCV", "YOLO", "PostgreSQL", "FastAPI"],
    featured: false,
    context:
      "Operações precisavam entender fluxo de pessoas em espaços físicos para otimizar recursos e escala de atendimento.",
    challenges: [
      "Detectar e rastrear pessoas com precisão aceitável em hardware limitado",
      "Calcular tempo de permanência mesmo com oclusione parcial da câmera",
      "Agregar métricas em tempo real sem sobrecarregar o banco de dados",
    ],
    decisions: [
      {
        title: "YOLO para detecção + tracker baseado em IoU",
        reasoning:
          "YOLO oferece velocidade adequada para processamento em tempo real. Tracker por IoU é simples e suficientemente robusto para cenários de baixa oclusione.",
      },
      {
        title: "Agregação em memória com flush periódico",
        reasoning:
          "Escrever no banco a cada frame seria impraticável. Acumula em memória e persiste em janelas de 1 minuto.",
      },
    ],
    tradeoffs:
      "Perda de dado em crash entre flushes. Aceitável dado que métricas operacionais têm tolerância a perda de dados pontual.",
    implementation:
      "Pipeline OpenCV + YOLO rodando em processo dedicado. API FastAPI expondo métricas agregadas. Dashboard com gráficos de fluxo por hora.",
    learnings: [
      "Calibrar a linha de contagem de entrada/saída requer testes presenciais no espaço físico",
      "Lighting varia muito ao longo do dia — normalização de histograma melhora consistência da detecção",
    ],
    en: {
      name: "Computer Vision Analytics",
      tagline: "People counting and dwell time for operational metrics",
      impact:
        "Computer vision pipeline for people counting and dwell time analysis generating real-time operational metrics.",
      context:
        "Operations needed to understand people flow in physical spaces to optimize staffing and service scale.",
      challenges: [
        "Detecting and tracking people with acceptable accuracy on limited hardware",
        "Calculating dwell time even with partial camera occlusion",
        "Aggregating real-time metrics without overloading the database",
      ],
      decisions: [
        {
          title: "YOLO for detection + IoU-based tracker",
          reasoning:
            "YOLO offers adequate speed for real-time processing. IoU-based tracker is simple and robust enough for low-occlusion scenarios.",
        },
        {
          title: "In-memory aggregation with periodic flush",
          reasoning:
            "Writing to the database every frame would be impractical. Accumulates in memory and persists in 1-minute windows.",
        },
      ],
      tradeoffs:
        "Data loss on crash between flushes. Acceptable given that operational metrics have tolerance for point-in-time data loss.",
      implementation:
        "OpenCV + YOLO pipeline running in a dedicated process. FastAPI exposing aggregated metrics. Dashboard with flow charts by hour.",
      learnings: [
        "Calibrating the entry/exit counting line requires on-site testing in the physical space",
        "Lighting varies greatly throughout the day — histogram normalization improves detection consistency",
      ],
    },
  },
  {
    slug: "service-licensing-system",
    name: "Sistema de Licenciamento de Serviços",
    domain: "Backend Engineering",
    tagline: "Ativação por token, gestão de permissões e CRUDs administrativos",
    impact:
      "Sistema de licenciamento com ativação por token, controle de permissões granular e painel administrativo completo.",
    stack: ["C#", ".NET", "PostgreSQL", "JWT", "REST APIs"],
    featured: false,
    context:
      "O produto precisava controlar acesso a funcionalidades por plano de licença, com ativação auto-serviço e gestão administrativa centralizada.",
    challenges: [
      "Modelar permissões granulares por funcionalidade sem explodir a complexidade do schema",
      "Fluxo de ativação por token com expiração e invalidação única",
      "Painel administrativo com CRUDs completos sem framework de admin pré-fabricado",
    ],
    decisions: [
      {
        title: "Tokens de ativação de uso único",
        reasoning:
          "Tokens gerados no ato da venda, hasheados no banco, válidos por N dias. Após uso são marcados como consumidos. Evita reuso e é simples de auditar.",
      },
      {
        title: "Permissões bit-flag em vez de tabela de junction",
        reasoning:
          "Volume de permissões é fixo e pequeno (<64). Bit-flag simplifica queries de verificação e reduz joins.",
      },
    ],
    tradeoffs:
      "Bit-flag torna a adição de novas permissões mais rígida. Aceito dado que o conjunto de funcionalidades é estável e pequeno.",
    implementation:
      ".NET 8 + EF Core + PostgreSQL. Tokens com hash SHA-256 + salt. JWT para sessões autenticadas com claims de permissão. Controllers REST com autorização baseada em policy.",
    learnings: [
      "Nunca armazenar token em texto plano — mesmo tokens de ativação devem ser hasheados",
      "Audit log em tabela separada para cada mutação de permissão é imprescindível para suporte",
    ],
    en: {
      name: "Service Licensing System",
      tagline: "Token activation, permission management, and admin CRUDs",
      impact:
        "Licensing system with token activation, granular permission control, and complete admin panel.",
      context:
        "The product needed to control access to features by license plan, with self-service activation and centralized admin management.",
      challenges: [
        "Modeling granular permissions per feature without exploding schema complexity",
        "Token activation flow with expiration and single-use invalidation",
        "Admin panel with complete CRUDs without a pre-made admin framework",
      ],
      decisions: [
        {
          title: "Single-use activation tokens",
          reasoning:
            "Tokens generated at sale, hashed in the database, valid for N days. After use, marked as consumed. Prevents reuse and is easy to audit.",
        },
        {
          title: "Bit-flag permissions instead of junction table",
          reasoning:
            "Permission count is fixed and small (<64). Bit-flag simplifies verification queries and reduces joins.",
        },
      ],
      tradeoffs:
        "Bit-flag makes adding new permissions more rigid. Accepted given that the feature set is stable and small.",
      implementation:
        ".NET 8 + EF Core + PostgreSQL. Tokens with SHA-256 + salt hash. JWT for authenticated sessions with permission claims. REST controllers with policy-based authorization.",
      learnings: [
        "Never store tokens in plain text — even activation tokens must be hashed",
        "Audit log in a separate table for each permission mutation is essential for support",
      ],
    },
  },
];

export function getProjectBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
