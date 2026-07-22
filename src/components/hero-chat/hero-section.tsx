"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ChevronDown, X, Send } from "lucide-react";
import { AgentChatResponse, AgentProjectMatch, UIChatMessage } from "@/lib/agent/types";
import { getPipelineStatusDisplay, useAgentHealth } from "@/hooks/use-agent-health";
import { ChatPanel } from "./chat-panel";
import { ContentPanel } from "./content-panel";
import type {
  LabDefinition,
  PageDomain,
  PersonalProject,
  WorkDetail,
} from "@/content/schemas";
import { trackSiteInteraction } from "@/lib/analytics/labs-analytics";

const SESSION_KEY = "portfolio_agent_session_id";

async function fetchAgentChat(
  message: string,
  sessionId: string | null,
  attempt = 0
): Promise<AgentChatResponse> {
  const res = await fetch("/api/agent/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: sessionId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const errorMsg = (err as { error?: string }).error ?? "Agent unavailable";

    // Retry once on cold-start / backend not ready (common on first message).
    if (attempt === 0 && (res.status === 502 || errorMsg.includes("unavailable"))) {
      await new Promise((r) => setTimeout(r, 1500));
      return fetchAgentChat(message, sessionId, 1);
    }

    throw new Error(errorMsg);
  }

  return res.json() as Promise<AgentChatResponse>;
}

export function HeroSection({
  domains,
  workIndex,
  projectIndex,
  labIndex,
}: {
  domains: PageDomain[];
  workIndex: WorkDetail[];
  projectIndex: PersonalProject[];
  labIndex: LabDefinition[];
}) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<UIChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(SESSION_KEY);
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [agentResponse, setAgentResponse] = useState<AgentChatResponse | null>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const chatOpenedRef = useRef(false);
  const { status: agentHealthStatus } = useAgentHealth();
  const pipelineStatus = getPipelineStatusDisplay(agentHealthStatus);
  const t = useTranslations("hero");

  // Trap focus inside overlay when open
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  // Track first chat open per session
  useEffect(() => {
    if (isOpen && !chatOpenedRef.current) {
      chatOpenedRef.current = true;
      trackSiteInteraction("hero-chat", "chat_opened", {
        session_id: sessionId ?? undefined,
      });
    }
  }, [isOpen, sessionId]);

  const handleSubmit = useCallback(
    async (query: string) => {
      const trimmed = query.trim();
      if (!trimmed || loading) return;

      trackSiteInteraction("hero-chat", "message_sent", {
        session_id: sessionId ?? undefined,
      });

      const userMsg: UIChatMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        content: trimmed,
      };

      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);
      setIsOpen(true);

      try {
        const data = await fetchAgentChat(trimmed, sessionId);

        try {
          localStorage.setItem(SESSION_KEY, data.session_id);
        } catch {
          // ignore
        }
        setSessionId(data.session_id);

        const agentMsg: UIChatMessage = {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: data.message,
        };
        setMessages((prev) => [...prev, agentMsg]);
        setAgentResponse(data);

        trackSiteInteraction("hero-chat", "message_received", {
          label: data.tool_used,
          value: data.matches.length,
          session_id: data.session_id,
        });
      } catch (err) {
        const errorLabel =
          err instanceof Error ? err.message.slice(0, 64) : "unknown";

        trackSiteInteraction("hero-chat", "chat_error", {
          label: errorLabel,
          session_id: sessionId ?? undefined,
        });

        const errorText =
          err instanceof Error
            ? err.message === "Agent unavailable"
              ? t("errorUnavailable")
              : err.message === "Agent request timed out"
                ? t("errorTimeout")
                : err.message
            : t("errorUnavailable");

        const errMsg: UIChatMessage = {
          id: `e-${Date.now()}`,
          role: "assistant",
          content: errorText,
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setLoading(false);
      }
    },
    [loading, sessionId, t]
  );

  const handleSelectMatch = useCallback(
    (match: AgentProjectMatch) => {
      if (!agentResponse) return;

      trackSiteInteraction("hero-chat", "match_click", {
        label: match.slug,
        value: Math.round(match.score * 100),
        session_id: agentResponse.session_id,
      });

      setAgentResponse({
        ...agentResponse,
        selected_project: match.id,
        selected_type: match.type,
        matches: [match, ...agentResponse.matches.filter((m) => m.id !== match.id)],
      });
    },
    [agentResponse]
  );

  const handleSuggestQuery = useCallback(
    (query: string) => {
      setIsOpen(true);
      handleSubmit(query);
    },
    [handleSubmit]
  );

  function handleHeroSubmit() {
    if (!inputValue.trim()) return;
    handleSubmit(inputValue);
    setInputValue("");
  }

  return (
    <>
      {/* ── Static hero section ─────────────────────────────────────────── */}
      <section
        className="relative w-full min-h-[calc(100dvh-var(--header-height))] flex flex-col overflow-hidden"
        style={{ background: "var(--hero-bg)" }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: "var(--gold)" }}
        />
        <div
          className="hero-grid-drift absolute inset-0 opacity-45 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--hero-grid-dot) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          className="animate-hero-orb-a absolute -top-24 -left-12 w-136 h-136 rounded-full blur-3xl pointer-events-none"
          style={{ background: "var(--hero-glow-1)" }}
        />
        <div
          className="animate-hero-orb-b absolute -bottom-24 -right-10 w-md h-112 rounded-full blur-3xl pointer-events-none"
          style={{ background: "var(--hero-glow-2)" }}
        />

        <div className="relative flex-1 content-width-wide mx-auto px-6 flex flex-col justify-center py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* ── Left column ─────────────────────────────────────────────── */}
            <div className="flex flex-col gap-8">
              <div className="hero-fade-0 flex items-center gap-3">
                <span
                  className="animate-pulse-dot inline-block w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: "var(--status-green)" }}
                />
                <span
                  className="text-mono text-xs tracking-[0.22em] uppercase"
                  style={{ color: "var(--gold)" }}
                >
                  {t("eyebrow")}
                </span>
              </div>

              <div className="hero-fade-1 flex flex-col gap-5">
                <h1
                  className="font-sans font-black uppercase tracking-[-0.02em] max-w-xl"
                  style={{
                    fontSize: "clamp(1.75rem, 4.2vw, 3.2rem)",
                    lineHeight: "1.05",
                    color: "var(--hero-text)",
                  }}
                >
                  {t("headline1")}
                  <br />
                  {t("headline2")}
                </h1>
                <p
                  className="text-mono text-[11px] leading-none tracking-[0.16em] uppercase"
                  style={{ color: "var(--hero-muted)" }}
                >
                  Lucas Caldas
                </p>
              </div>

              <p
                className="hero-fade-2 text-base leading-relaxed max-w-xl"
                style={{ color: "var(--hero-muted)" }}
              >
                {t("lead")}
              </p>

              <div className="hero-fade-2 flex flex-wrap gap-2.5 max-w-xl">
                {domains.map((domain) => (
                  <span
                    key={domain.title}
                    className="text-mono text-[10px] tracking-[0.14em] uppercase px-3 py-1 rounded-full border"
                    style={{
                      color: "var(--hero-text)",
                      borderColor: "var(--hero-border)",
                      backgroundColor: "var(--hero-chip-bg)",
                    }}
                  >
                    {domain.title}
                  </span>
                ))}
              </div>

              <div className="hero-fade-3 flex items-center gap-4 flex-wrap">
                <Link
                  href="/work"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-opacity hover:opacity-85"
                  style={{
                    backgroundColor: "var(--gold)",
                    color: "var(--hero-bg)",
                  }}
                >
                  {t("ctaCases")} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium border transition-all hover:border-(--gold)/60"
                  style={{
                    backgroundColor: "var(--hero-panel)",
                    borderColor: "var(--hero-border)",
                    color: "var(--hero-text)",
                  }}
                >
                  {t("ctaAbout")}
                </Link>
              </div>
            </div>

            {/* ── Right column ────────────────────────────────────────────── */}
            <div className="flex flex-col gap-4">
              {/* Delivery Pipeline panel */}
              <div
                className="hero-panel-in hero-panel-float rounded-xl overflow-hidden border"
                style={{
                  backgroundColor: "var(--hero-panel)",
                  borderColor: "var(--hero-border)",
                }}
              >
                <div className="h-0.5" style={{ background: "var(--gold)" }} />
                <div
                  className="flex items-center justify-between px-5 py-4 border-b"
                  style={{ borderColor: "var(--hero-border)" }}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-block w-2 h-2 rounded-full shrink-0${pipelineStatus.dotPulse ? " animate-pulse-dot" : ""}`}
                      style={{ backgroundColor: pipelineStatus.dotColor }}
                    />
                    <span
                      className="text-mono text-xs tracking-[0.14em] uppercase"
                      style={{ color: "var(--hero-text)" }}
                    >
                      {t("pipelineTitle")}
                    </span>
                  </div>
                  <span
                    className="text-mono text-[10px] tracking-[0.12em] px-2.5 py-0.5 rounded-full uppercase border"
                    style={{
                      color: pipelineStatus.badgeColor,
                      borderColor: pipelineStatus.badgeBorderColor,
                      backgroundColor: pipelineStatus.badgeBackgroundColor,
                    }}
                  >
                    {pipelineStatus.badgeLabel}
                  </span>
                </div>
                <div
                  className="px-5 py-4 border-b"
                  style={{ borderColor: "var(--hero-border)" }}
                >
                  <p
                    className="text-mono text-[10px] tracking-[0.16em] uppercase mb-3"
                    style={{ color: "var(--gold)" }}
                  >
                    {t("outcomeFocus")}
                  </p>
                  <div className="flex flex-col gap-0.5">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--hero-text)" }}
                    >
                      {t("outcomeTitle")}
                    </span>
                    <span
                      className="text-mono text-xs"
                      style={{ color: "var(--hero-muted)" }}
                    >
                      {t("outcomeSubtitle")}
                    </span>
                  </div>
                </div>
                <div
                  className="px-5 py-4 border-b"
                  style={{ borderColor: "var(--hero-border)" }}
                >
                  <p
                    className="text-mono text-[10px] tracking-[0.16em] uppercase mb-3"
                    style={{ color: "var(--gold)" }}
                  >
                    {t("coreExpertise")}
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {domains.slice(0, 4).map((domain) => (
                      <li
                        key={domain.title}
                        className="flex items-center gap-2.5 text-sm"
                        style={{ color: "var(--hero-text)" }}
                      >
                        <span style={{ color: "var(--gold)" }}>›</span>
                        {domain.title}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-5 py-4">
                  <p
                    className="text-mono text-[10px] tracking-[0.16em] uppercase mb-3"
                    style={{ color: "var(--gold)" }}
                  >
                    {t("activeStack")}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {[
                      "Python · C# · TypeScript",
                      "GCP · Vertex AI · ADK",
                      "MLOps · Airflow DAGs · Apache",
                    ].map((line) => (
                      <p
                        key={line}
                        className="text-mono text-xs"
                        style={{ color: "var(--hero-muted)" }}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Assistant input panel */}
              <div
                className="hero-fade-4 rounded-xl border-2 p-4"
                style={{
                  backgroundColor: "var(--hero-panel)",
                  borderColor: "var(--gold)",
                  boxShadow:
                    "0 0 0 1px var(--hero-border), 0 10px 30px oklch(0.10 0.02 260 / 0.22)",
                }}
              >
                <label
                  htmlFor="hero-site-query"
                  className="text-mono text-[10px] tracking-[0.16em] uppercase mb-2 block"
                  style={{ color: "var(--gold)" }}
                >
                  {t("queryLabel")}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="hero-site-query"
                    ref={heroInputRef}
                    name="hero-site-query"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleHeroSubmit();
                      }
                    }}
                    placeholder={t("placeholder")}
                    className="flex-1 rounded-md border px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2"
                    style={{
                      borderColor: "var(--hero-border)",
                      color: "var(--hero-text)",
                    }}
                    aria-label={t("ariaDescribe")}
                  />
                  <button
                    onClick={handleHeroSubmit}
                    disabled={!inputValue.trim()}
                    className="shrink-0 p-2 rounded-md transition-opacity disabled:opacity-30 hover:opacity-70"
                    style={{ color: "var(--gold)" }}
                    aria-label={t("ariaSubmit")}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p
                  className="text-mono text-[10px] tracking-[0.08em] mt-2"
                  style={{ color: "var(--hero-muted)" }}
                >
                  {t("queryHint")}
                </p>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
            <span
              className="text-mono text-[9px] tracking-[0.22em] uppercase"
              style={{ color: "var(--hero-muted)" }}
            >
              {t("scroll")}
            </span>
            <ChevronDown
              className="animate-scroll-bounce w-4 h-4"
              style={{ color: "var(--hero-muted)" }}
            />
          </div>
        </div>
      </section>

      {/* ── Split overlay (full-screen when open) ─────────────────────────── */}
      {isOpen && (
        <dialog
          open
          className="fixed inset-0 z-50 flex flex-col animate-split-in m-0 p-0 border-0 w-full h-full max-w-none max-h-none"
          style={{ background: "var(--hero-bg)" }}
          aria-label={t("ariaAssistant")}
        >
          {/* Ambient grid (decorative) */}
          <div
            className="hero-grid-drift absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, var(--hero-grid-dot) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Top gold line */}
          <div
            className="h-0.5 shrink-0 relative z-10"
            style={{ background: "var(--gold)" }}
          />

          {/* Header */}
          <div
            className="relative z-10 flex items-center justify-between px-5 py-3 shrink-0"
            style={{ borderBottom: "1px solid var(--hero-border)" }}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="animate-pulse-dot inline-block w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: "var(--status-green)" }}
              />
              <span
                className="text-mono text-xs tracking-[0.18em] uppercase"
                style={{ color: "var(--gold)" }}
              >
                Lucas Caldas
              </span>
              <span
                className="hidden sm:inline text-mono text-[10px] tracking-widest"
                style={{ color: "var(--hero-muted)" }}
              >
                · Backend · AI · GCP
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg border transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2"
              style={{
                borderColor: "var(--hero-border)",
                color: "var(--hero-muted)",
              }}
              aria-label={t("ariaClose")}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Split panels */}
          <div className="relative z-10 flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left: Chat */}
            <div className="lg:w-[40%] shrink-0 flex flex-col overflow-hidden animate-chat-panel-in">
              <ChatPanel
                messages={messages}
                loading={loading}
                onSubmit={handleSubmit}
              />
            </div>

            {/* Vertical divider (desktop) */}
            <div
              className="hidden lg:block w-px shrink-0"
              style={{ backgroundColor: "var(--hero-border)" }}
            />

            {/* Horizontal divider (mobile) */}
            <div
              className="lg:hidden h-px shrink-0"
              style={{ backgroundColor: "var(--hero-border)" }}
            />

            {/* Right: Content */}
            <div className="flex-1 flex flex-col overflow-hidden animate-content-panel-in">
              <div
                className="px-5 py-3 shrink-0"
                style={{ borderBottom: "1px solid var(--hero-border)" }}
              >
                <p
                  className="text-mono text-[10px] uppercase tracking-[0.16em]"
                  style={{ color: "var(--hero-muted)" }}
                >
                  {t("recommendedContent")}
                </p>
              </div>
              <ContentPanel
                response={agentResponse}
                onSelectMatch={handleSelectMatch}
                onSuggestQuery={handleSuggestQuery}
                workIndex={workIndex}
                projectIndex={projectIndex}
                labIndex={labIndex}
              />
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
