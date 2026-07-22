"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ExternalLink } from "lucide-react";
import { AgentChatResponse, AgentProjectMatch } from "@/lib/agent/types";
import type {
  LabDefinition,
  PersonalProject,
  WorkDetail,
} from "@/content/schemas";
import { trackContentLinkClick } from "@/lib/analytics/labs-analytics";

interface ContentPanelProps {
  response: AgentChatResponse | null;
  onSelectMatch: (match: AgentProjectMatch) => void;
  onSuggestQuery?: (query: string) => void;
  workIndex: WorkDetail[];
  projectIndex: PersonalProject[];
  labIndex: LabDefinition[];
}

interface NormalizedItem {
  type: "project" | "lab" | "personal_project";
  name: string;
  tagline: string;
  domain: string;
  stack: string[];
  context: string;
  challenges: string[];
  metrics: { label: string; value: string }[];
  href: string;
  slug: string;
}

function findWork(workIndex: WorkDetail[], id: string): WorkDetail | undefined {
  return workIndex.find((w) => w.slug === id);
}

function findPersonalProject(
  projectIndex: PersonalProject[],
  id: string,
): PersonalProject | undefined {
  return projectIndex.find((p) => p.slug === id);
}

function findLab(
  labIndex: LabDefinition[],
  id: string,
): LabDefinition | undefined {
  return labIndex.find((l) => l.slug === id);
}

function getLocalData(
  id: string,
  type: "project" | "lab" | "personal_project",
  workIndex: WorkDetail[],
  projectIndex: PersonalProject[],
  labIndex: LabDefinition[],
): NormalizedItem | null {
  if (type === "personal_project") {
    const pp = findPersonalProject(projectIndex, id);
    if (!pp) return null;
    return {
      type: "personal_project",
      name: pp.name,
      tagline: pp.tagline,
      domain: pp.domain,
      stack: pp.stack,
      context: pp.overview,
      challenges: [],
      metrics: (pp.metrics ?? []).slice(0, 4),
      href: `/projects/${id}`,
      slug: id,
    };
  }
  if (type === "project") {
    const r = findWork(workIndex, id);
    if (!r) return null;
    return {
      type: "project",
      name: r.name,
      tagline: r.tagline,
      domain: r.domain,
      stack: r.stack,
      context: r.context ?? "",
      challenges: (r.challenges ?? []).slice(0, 2),
      metrics: (r.metrics ?? []).slice(0, 4),
      href: `/work/${id}`,
      slug: id,
    };
  }
  const lab = findLab(labIndex, id);
  if (!lab) return null;
  return {
    type: "lab",
    name: lab.title,
    tagline: lab.summary,
    domain: lab.domain,
    stack: lab.demonstrates,
    context: [lab.narrative[0], lab.narrative[1]].filter(Boolean).join(" "),
    challenges: [],
    metrics: [],
    href: `/labs/${id}`,
    slug: id,
  };
}

function getMatchDescription(
  match: AgentProjectMatch,
  workIndex: WorkDetail[],
  projectIndex: PersonalProject[],
  labIndex: LabDefinition[],
): string {
  if (match.type === "personal_project") {
    const pp = findPersonalProject(projectIndex, match.id);
    if (pp) return pp.tagline;
  } else if (match.type === "project") {
    const work = findWork(workIndex, match.id);
    if (work) return work.tagline;
  } else {
    const lab = findLab(labIndex, match.id);
    if (lab) return lab.summary;
  }
  return match.title;
}

// ── Sub-components ──────────────────────────────────────────────────────────

function TypeTag({ type }: { type: "project" | "lab" | "personal_project" }) {
  const t = useTranslations("hero");
  const styles =
    type === "project"
      ? {
          color: "oklch(0.65 0.15 230)",
          borderColor: "oklch(0.65 0.15 230 / 0.3)",
          backgroundColor: "oklch(0.65 0.15 230 / 0.08)",
          label: t("typeProject"),
        }
      : type === "lab"
        ? {
            color: "oklch(0.72 0.18 145)",
            borderColor: "oklch(0.72 0.18 145 / 0.3)",
            backgroundColor: "oklch(0.72 0.18 145 / 0.08)",
            label: t("typeLab"),
          }
        : {
            color: "oklch(0.78 0.16 310)",
            borderColor: "oklch(0.78 0.16 310 / 0.3)",
            backgroundColor: "oklch(0.78 0.16 310 / 0.08)",
            label: t("typePersonal"),
          };

  return (
    <span
      className="text-mono text-[9px] uppercase tracking-[0.14em] px-2 py-0.5 rounded-full border"
      style={{
        color: styles.color,
        borderColor: styles.borderColor,
        backgroundColor: styles.backgroundColor,
      }}
    >
      {styles.label}
    </span>
  );
}

// Compact card shown in the WelcomeState before any interaction.
function FeaturedCard({
  item,
  onSelect,
}: {
  item: NormalizedItem;
  onSelect: () => void;
}) {
  const t = useTranslations("hero");

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: "var(--hero-chip-bg)",
        borderColor: "var(--hero-border)",
      }}
    >
      <div className="px-4 py-3.5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="badge-gold">{item.domain}</span>
            <TypeTag type={item.type} />
          </div>
          <Link
            href={item.href}
            onClick={() => trackContentLinkClick(item.href, item.slug)}
            className="shrink-0 p-1 rounded-md border transition-opacity hover:opacity-70"
            style={{
              borderColor: "var(--hero-border)",
              color: "var(--hero-muted)",
            }}
            title={t("openFullPage")}
          >
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
        <p
          className="text-sm font-semibold leading-snug mb-1"
          style={{ color: "var(--hero-text)" }}
        >
          {item.name}
        </p>
        <p
          className="text-xs leading-relaxed mb-3 line-clamp-2"
          style={{ color: "var(--hero-muted)" }}
        >
          {item.tagline}
        </p>
        <button
          onClick={onSelect}
          className="inline-flex items-center gap-1.5 text-mono text-[10px] uppercase tracking-[0.12em] transition-opacity hover:opacity-70"
          style={{ color: "var(--gold)" }}
        >
          {t("askAboutThis")} <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

const FEATURED_SLUGS: Array<{
  id: string;
  type: "project" | "lab" | "personal_project";
}> = [
  { id: "drop", type: "personal_project" },
  { id: "quark", type: "personal_project" },
  { id: "passanota", type: "personal_project" },
];

function useDomainChips() {
  const t = useTranslations("hero");
  return [
    { label: t("chipAi"), query: t("chipAiQuery") },
    { label: t("chipBackend"), query: t("chipBackendQuery") },
    { label: t("chipCloud"), query: t("chipCloudQuery") },
    { label: t("chipMlops"), query: t("chipMlopsQuery") },
  ];
}

function WelcomeState({
  onSuggestQuery,
  workIndex,
  projectIndex,
  labIndex,
}: {
  onSuggestQuery?: (query: string) => void;
  workIndex: WorkDetail[];
  projectIndex: PersonalProject[];
  labIndex: LabDefinition[];
}) {
  const domainChips = useDomainChips();
  const t = useTranslations("hero");
  const featuredItems = FEATURED_SLUGS.map(({ id, type }) =>
    getLocalData(id, type, workIndex, projectIndex, labIndex),
  ).filter(Boolean) as NormalizedItem[];

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
      {/* Intro */}
      <div>
        <p
          className="text-mono text-[10px] uppercase tracking-[0.16em] mb-1.5"
          style={{ color: "var(--gold)" }}
        >
          {t("welcomeEyebrow")}
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "var(--hero-muted)" }}>
          {t("welcomeBody")}
        </p>
      </div>

      {/* Domain exploration chips */}
      {onSuggestQuery && (
        <div>
          <p
            className="text-mono text-[10px] uppercase tracking-[0.16em] mb-2"
            style={{ color: "var(--hero-muted)" }}
          >
            {t("exploreByDomain")}
          </p>
          <div className="flex flex-wrap gap-2">
            {domainChips.map((chip) => (
              <button
                key={chip.label}
                onClick={() => onSuggestQuery(chip.query)}
                className="text-mono text-[10px] uppercase tracking-[0.12em] px-3 py-1.5 rounded-full border transition-all hover:border-(--gold)/50 hover:text-(--gold)"
                style={{
                  color: "var(--hero-text)",
                  borderColor: "var(--hero-border)",
                  backgroundColor: "var(--hero-chip-bg)",
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Featured project cards */}
      {featuredItems.length > 0 && (
        <div className="flex flex-col gap-3">
          {featuredItems.map((item) => (
            <FeaturedCard
              key={item.slug}
              item={item}
              onSelect={() =>
                onSuggestQuery?.(`Tell me about ${item.name}`)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MainItemCard({ item }: { item: NormalizedItem }) {
  const t = useTranslations("hero");
  const ctaLabel =
    item.type === "project"
      ? t("fullCaseStudy")
      : item.type === "personal_project"
        ? t("viewProject")
        : t("viewLab");

  return (
    <div
      className="rounded-xl border overflow-hidden content-panel-in"
      style={{
        backgroundColor: "var(--hero-panel)",
        borderColor: "var(--hero-border)",
      }}
    >
      <div className="h-0.5 shrink-0" style={{ background: "var(--gold)" }} />
      <div className="px-6 py-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="badge-gold">{item.domain}</span>
            <TypeTag type={item.type} />
          </div>
          <Link
            href={item.href}
            onClick={() => trackContentLinkClick(item.href, item.slug)}
            className="shrink-0 p-1.5 rounded-lg border transition-opacity hover:opacity-70"
            style={{
              borderColor: "var(--hero-border)",
              color: "var(--hero-muted)",
            }}
            title={t("openFullPage")}
            target="_self"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Title + tagline */}
        <h2
          className="font-display font-bold text-xl leading-tight mb-2"
          style={{ color: "var(--hero-text)" }}
        >
          {item.name}
        </h2>
        <p
          className="text-sm leading-relaxed mb-4"
          style={{ color: "var(--hero-muted)" }}
        >
          {item.tagline}
        </p>

        {/* Stack / Demonstrates */}
        {item.stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.stack.slice(0, 7).map((tech) => (
              <span
                key={tech}
                className="text-mono text-[10px] px-2 py-0.5 rounded border"
                style={{
                  color: "var(--hero-muted)",
                  borderColor: "var(--hero-border)",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Context */}
        {item.context && (
          <div className="mb-4">
            <p
              className="text-mono text-[10px] uppercase tracking-[0.14em] mb-2"
              style={{ color: "var(--gold)" }}
            >
              Context
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--hero-muted)" }}
            >
              {item.context.length > 220
                ? item.context.slice(0, 220) + "..."
                : item.context}
            </p>
          </div>
        )}

        {/* Key challenges */}
        {item.challenges.length > 0 && (
          <div className="mb-4">
            <p
              className="text-mono text-[10px] uppercase tracking-[0.14em] mb-2"
              style={{ color: "var(--gold)" }}
            >
              Key challenges
            </p>
            <ul className="flex flex-col gap-1.5">
              {item.challenges.map((c, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs"
                  style={{ color: "var(--hero-muted)" }}
                >
                  <span style={{ color: "var(--gold)" }} className="shrink-0">
                    ›
                  </span>
                  <span className="leading-relaxed">
                    {c.length > 130 ? c.slice(0, 130) + "..." : c}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Metrics */}
        {item.metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {item.metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-lg p-2.5 border"
                style={{
                  backgroundColor: "var(--hero-chip-bg)",
                  borderColor: "var(--hero-border)",
                }}
              >
                <p
                  className="text-mono text-[9px] uppercase tracking-[0.12em]"
                  style={{ color: "var(--hero-muted)" }}
                >
                  {m.label}
                </p>
                <p
                  className="text-sm font-semibold mt-0.5"
                  style={{ color: "var(--hero-text)" }}
                >
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <Link
          href={item.href}
          onClick={() => trackContentLinkClick(item.href, item.slug)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-85"
          style={{ backgroundColor: "var(--gold)", color: "var(--hero-bg)" }}
        >
          {ctaLabel}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function RecommendationCard({
  match,
  onSelect,
  workIndex,
  projectIndex,
  labIndex,
}: {
  match: AgentProjectMatch;
  onSelect: (m: AgentProjectMatch) => void;
  workIndex: WorkDetail[];
  projectIndex: PersonalProject[];
  labIndex: LabDefinition[];
}) {
  const desc = getMatchDescription(match, workIndex, projectIndex, labIndex);
  return (
    <button
      onClick={() => onSelect(match)}
      className="text-left w-full rounded-xl border p-4 transition-all hover:border-(--gold)/40 group"
      style={{
        backgroundColor: "var(--hero-chip-bg)",
        borderColor: "var(--hero-border)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <TypeTag type={match.type} />
          </div>
          <p
            className="text-sm font-medium leading-snug"
            style={{ color: "var(--hero-text)" }}
          >
            {match.title}
          </p>
          {desc && (
            <p
              className="text-xs mt-1 leading-relaxed line-clamp-2"
              style={{ color: "var(--hero-muted)" }}
            >
              {desc}
            </p>
          )}
        </div>
        <ArrowRight
          className="w-3.5 h-3.5 shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5"
          style={{ color: "var(--hero-muted)" }}
        />
      </div>
    </button>
  );
}

function NoMatchState({
  matches,
  onSelectMatch,
  onSuggestQuery,
  workIndex,
  projectIndex,
  labIndex,
}: {
  matches: AgentProjectMatch[];
  onSelectMatch: (match: AgentProjectMatch) => void;
  onSuggestQuery?: (query: string) => void;
  workIndex: WorkDetail[];
  projectIndex: PersonalProject[];
  labIndex: LabDefinition[];
}) {
  const domainChips = useDomainChips();

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
      <p className="text-sm" style={{ color: "var(--hero-muted)" }}>
        No specific match found. Try rephrasing with a technology name, domain,
        or specific challenge.
      </p>
      {matches.length > 0 && (
        <>
          <p
            className="text-mono text-[10px] uppercase tracking-[0.16em]"
            style={{ color: "var(--gold)" }}
          >
            Closest results
          </p>
          {matches.slice(0, 4).map((m) => (
            <RecommendationCard
              key={m.id}
              match={m}
              onSelect={onSelectMatch}
              workIndex={workIndex}
              projectIndex={projectIndex}
              labIndex={labIndex}
            />
          ))}
        </>
      )}
      {matches.length === 0 && onSuggestQuery && (
        <div className="flex flex-wrap gap-2 mt-2">
          {domainChips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => onSuggestQuery(chip.query)}
              className="text-mono text-[10px] uppercase tracking-[0.12em] px-3 py-1.5 rounded-full border transition-all hover:border-(--gold)/50"
              style={{
                color: "var(--hero-muted)",
                borderColor: "var(--hero-border)",
                backgroundColor: "var(--hero-chip-bg)",
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function ContentPanel({
  response,
  onSelectMatch,
  onSuggestQuery,
  workIndex,
  projectIndex,
  labIndex,
}: ContentPanelProps) {
  if (!response) {
    return (
      <WelcomeState
        onSuggestQuery={onSuggestQuery}
        workIndex={workIndex}
        projectIndex={projectIndex}
        labIndex={labIndex}
      />
    );
  }

  const { selected_project, selected_type, matches } = response;

  if (!selected_project || !selected_type) {
    return (
      <NoMatchState
        matches={matches}
        onSelectMatch={onSelectMatch}
        onSuggestQuery={onSuggestQuery}
        workIndex={workIndex}
        projectIndex={projectIndex}
        labIndex={labIndex}
      />
    );
  }

  const mainItem = getLocalData(
    selected_project,
    selected_type,
    workIndex,
    projectIndex,
    labIndex,
  );
  const recommendations = matches.slice(1, 4);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 flex flex-col gap-5">
        {mainItem && <MainItemCard item={mainItem} />}

        {recommendations.length > 0 && (
          <div className="flex flex-col gap-3">
            <p
              className="text-mono text-[10px] uppercase tracking-[0.16em]"
              style={{ color: "var(--gold)" }}
            >
              Related work
            </p>
            {recommendations.map((rec) => (
              <RecommendationCard
                key={rec.id}
                match={rec}
                onSelect={onSelectMatch}
                workIndex={workIndex}
                projectIndex={projectIndex}
                labIndex={labIndex}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
