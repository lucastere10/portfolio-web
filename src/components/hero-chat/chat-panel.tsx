"use client";

import { useRef, useEffect, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { UIChatMessage } from "@/lib/agent-types";

interface ChatPanelProps {
  messages: UIChatMessage[];
  loading: boolean;
  onSubmit: (query: string) => void;
}

function MessageContent({ content }: { content: string }) {
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = content.split(pattern);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }

        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          return (
            <a
              key={i}
              href={linkMatch[2]}
              className="underline underline-offset-2 hover:opacity-80"
              style={{ color: "var(--gold)" }}
            >
              {linkMatch[1]}
            </a>
          );
        }

        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export function ChatPanel({ messages, loading, onSubmit }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function handleSubmit() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    onSubmit(trimmed);
    setInput("");
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
        aria-label="Chat messages"
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
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Ask a follow-up question..."
            className="flex-1 bg-transparent text-sm focus:outline-none"
            style={{ color: "var(--hero-text)" }}
            disabled={loading}
            aria-label="Follow-up message input"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="shrink-0 p-1 rounded-lg transition-opacity disabled:opacity-30 hover:opacity-75"
            style={{ color: "var(--gold)" }}
            aria-label="Send message"
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
