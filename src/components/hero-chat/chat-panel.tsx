"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Send, Loader2 } from "lucide-react";
import { UIChatMessage } from "@/lib/agent/types";

interface ChatPanelProps {
  messages: UIChatMessage[];
  loading: boolean;
  onSubmit: (query: string) => void;
}

const LINK_CLASS =
  "underline underline-offset-2 hover:opacity-80 break-all";

function ChatLink({ href, children }: { href: string; children: ReactNode }) {
  const external = /^https?:\/\//i.test(href);
  return (
    <a
      href={href}
      className={LINK_CLASS}
      style={{ color: "var(--gold)" }}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {children}
    </a>
  );
}

/** Inline: **bold**, *italic*, [text](url), bare https:// and /site paths */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const pattern =
    /(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s<>\]]+|\/(?:en\/)?(?:contact|about|work|projects|labs)(?:\/[^\s)\].,;:!?]*)?)/g;
  const parts = text.split(pattern);

  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (!part) return null;

    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (
      ((part.startsWith("*") && part.endsWith("*")) ||
        (part.startsWith("_") && part.endsWith("_"))) &&
      part.length > 2 &&
      !part.startsWith("**")
    ) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }

    const mdLink = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (mdLink) {
      return (
        <ChatLink key={key} href={mdLink[2]}>
          {mdLink[1]}
        </ChatLink>
      );
    }

    if (/^https?:\/\//i.test(part)) {
      return (
        <ChatLink key={key} href={part}>
          {part}
        </ChatLink>
      );
    }

    if (
      /^\/(?:en\/)?(?:contact|about|work|projects|labs)(?:\/[^\s)\].,;!?]*)?$/.test(
        part,
      )
    ) {
      return (
        <ChatLink key={key} href={part}>
          {part}
        </ChatLink>
      );
    }

    return <span key={key}>{part}</span>;
  });
}

function MessageContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let listItems: string[] = [];
  let blockKey = 0;

  function flushList() {
    if (listItems.length === 0) return;
    const items = listItems;
    listItems = [];
    blocks.push(
      <ul key={`ul-${blockKey++}`} className="list-disc pl-4 my-1 space-y-0.5">
        {items.map((item, i) => (
          <li key={i}>{renderInline(item, `li-${blockKey}-${i}`)}</li>
        ))}
      </ul>,
    );
  }

  for (const line of lines) {
    const bullet = line.match(/^\s*[-*]\s+(.+)$/);
    if (bullet) {
      listItems.push(bullet[1]);
      continue;
    }
    flushList();
    if (line.trim() === "") {
      blocks.push(<div key={`br-${blockKey++}`} className="h-2" />);
      continue;
    }
    blocks.push(
      <p key={`p-${blockKey++}`} className="my-0.5">
        {renderInline(line, `p-${blockKey}`)}
      </p>,
    );
  }
  flushList();

  return <div className="space-y-0.5">{blocks}</div>;
}

export function ChatPanel({ messages, loading, onSubmit }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wasLoading = useRef(false);
  const t = useTranslations("hero");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (wasLoading.current && !loading) {
      inputRef.current?.focus();
    }
    wasLoading.current = loading;
  }, [loading]);

  function handleSubmit() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    onSubmit(trimmed);
    setInput("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{ borderRight: "1px solid var(--hero-border)" }}
    >
      {/* Header */}
      <div
        className="px-5 py-3.5 shrink-0 flex items-center gap-2.5"
        style={{ borderBottom: "1px solid var(--hero-border)" }}
      >
        <span
          className="animate-pulse-dot inline-block w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: "var(--status-green)" }}
        />
        <span
          className="text-mono text-xs tracking-[0.16em] uppercase"
          style={{ color: "var(--hero-text)" }}
        >
          Conversation
        </span>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3"
        aria-live="polite"
        aria-label={t("ariaMessages")}
      >
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p
              className="text-mono text-xs text-center"
              style={{ color: "var(--hero-muted)" }}
            >
              Your conversation will appear here.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`animate-message-in flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div
                className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[8px] font-bold mr-2 mt-0.5"
                style={{
                  backgroundColor: "var(--gold)",
                  color: "var(--hero-bg)",
                }}
              >
                LC
              </div>
            )}
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user" ? "rounded-br-sm" : "rounded-bl-sm"
              }`}
              style={
                msg.role === "user"
                  ? {
                      backgroundColor: "var(--gold)",
                      color: "var(--hero-bg)",
                    }
                  : {
                      backgroundColor: "var(--hero-panel)",
                      border: "1px solid var(--hero-border)",
                      color: "var(--hero-text)",
                    }
              }
            >
              <MessageContent content={msg.content} />
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-message-in">
            <div
              className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[8px] font-bold mr-2 mt-0.5"
              style={{
                backgroundColor: "var(--gold)",
                color: "var(--hero-bg)",
              }}
            >
              LC
            </div>
            <div
              className="rounded-2xl rounded-bl-sm px-4 py-2.5 flex items-center gap-2"
              style={{
                backgroundColor: "var(--hero-panel)",
                border: "1px solid var(--hero-border)",
              }}
            >
              <Loader2
                className="w-3.5 h-3.5 animate-spin"
                style={{ color: "var(--gold)" }}
              />
              <span
                className="text-mono text-xs"
                style={{ color: "var(--hero-muted)" }}
              >
                Analyzing...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="px-5 py-4 shrink-0"
        style={{ borderTop: "1px solid var(--hero-border)" }}
      >
        <div
          className="flex items-center gap-2 rounded-xl border px-3.5 py-2.5 transition-shadow focus-within:shadow-[0_0_0_2px_var(--gold)]"
          style={{
            borderColor: "var(--hero-border)",
            backgroundColor: "var(--hero-panel)",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={t("followUpPlaceholder")}
            className="flex-1 bg-transparent text-sm focus:outline-none"
            style={{ color: "var(--hero-text)" }}
            aria-label={t("ariaFollowUp")}
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="shrink-0 p-1 rounded-lg transition-opacity disabled:opacity-30 hover:opacity-75"
            style={{ color: "var(--gold)" }}
            aria-label={t("ariaSend")}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p
          className="text-mono text-[10px] mt-2 tracking-[0.06em]"
          style={{ color: "var(--hero-muted)" }}
        >
          Ask about specific technologies, domains, or challenges.
        </p>
      </div>
    </div>
  );
}
