"use client";

import { useState, type FormEvent } from "react";

import type { ContactFormState } from "@/lib/contact";

const inputClassName =
  "w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

const labelClassName =
  "text-mono text-xs font-medium tracking-widest uppercase text-muted-foreground";

export function ContactForm() {
  const [state, setState] = useState<ContactFormState>({ ok: false });
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setState({ ok: false });

    const form = event.currentTarget;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: new FormData(form),
      });
      const data = (await res.json()) as ContactFormState;

      if (data.ok) {
        setState({ ok: true });
        form.reset();
      } else {
        setState({
          ok: false,
          error: data.error ?? "Could not send your message.",
          fieldErrors: data.fieldErrors,
        });
      }
    } catch {
      setState({
        ok: false,
        error: "Could not send your message. Please try again.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-lg">
      <div
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {state.ok && !pending && (
        <p
          role="status"
          aria-live="polite"
          className="rounded-md border border-border bg-muted/40 px-4 py-3 text-sm text-foreground"
        >
          Thanks! Your message was sent. I&apos;ll get back to you soon.
        </p>
      )}

      {state.error && (
        <p
          role="alert"
          aria-live="polite"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="name" className={labelClassName}>
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          maxLength={100}
          placeholder="Your name"
          aria-invalid={Boolean(state.fieldErrors?.name)}
          aria-describedby={state.fieldErrors?.name ? "name-error" : undefined}
          className={inputClassName}
        />
        {state.fieldErrors?.name && (
          <p id="name-error" className="text-xs text-destructive">
            {state.fieldErrors.name}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className={labelClassName}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          maxLength={254}
          placeholder="you@company.com"
          aria-invalid={Boolean(state.fieldErrors?.email)}
          aria-describedby={
            state.fieldErrors?.email ? "email-error" : undefined
          }
          className={inputClassName}
        />
        {state.fieldErrors?.email && (
          <p id="email-error" className="text-xs text-destructive">
            {state.fieldErrors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="context" className={labelClassName}>
          Project context
        </label>
        <textarea
          id="context"
          name="context"
          rows={5}
          maxLength={5000}
          placeholder="Describe what you are building, what kind of help you need, and any relevant constraints."
          className={`${inputClassName} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center bg-foreground text-background text-sm font-medium px-5 py-2.5 rounded-md hover:opacity-80 transition-opacity w-fit cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
