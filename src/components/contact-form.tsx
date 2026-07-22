"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import type {
  ContactErrorCode,
  ContactFieldErrorCode,
  ContactFormState,
} from "@/lib/contact";

const inputClassName =
  "w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

const labelClassName =
  "text-mono text-xs font-medium tracking-widest uppercase text-muted-foreground";

const FIELD_ERROR_KEYS: Record<ContactFieldErrorCode, string> = {
  name_required: "errorNameRequired",
  email_required: "errorEmailRequired",
  email_invalid: "errorEmailInvalid",
};

const ERROR_KEYS: Record<ContactErrorCode, string> = {
  validation_failed: "errorValidation",
  rate_limited: "errorRateLimited",
  invalid_form: "errorInvalidForm",
  send_failed: "errorRetry",
};

export function ContactForm() {
  const t = useTranslations("contactForm");
  const [state, setState] = useState<ContactFormState>({ ok: false });
  const [pending, setPending] = useState(false);

  function mapError(code?: string): string {
    if (!code) return t("errorGeneric");
    const key = ERROR_KEYS[code as ContactErrorCode];
    return key ? t(key) : t("errorGeneric");
  }

  function mapFieldError(code?: ContactFieldErrorCode): string | undefined {
    if (!code) return undefined;
    return t(FIELD_ERROR_KEYS[code]);
  }

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
          error: data.error,
          fieldErrors: data.fieldErrors,
        });
      }
    } catch {
      setState({
        ok: false,
        error: "send_failed",
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
          {t("success")}
        </p>
      )}

      {state.error && (
        <p
          role="alert"
          aria-live="polite"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {mapError(state.error)}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="name" className={labelClassName}>
          {t("name")}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          maxLength={100}
          placeholder={t("namePlaceholder")}
          aria-invalid={Boolean(state.fieldErrors?.name)}
          aria-describedby={state.fieldErrors?.name ? "name-error" : undefined}
          className={inputClassName}
        />
        {state.fieldErrors?.name && (
          <p id="name-error" className="text-xs text-destructive">
            {mapFieldError(state.fieldErrors.name)}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className={labelClassName}>
          {t("email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          maxLength={254}
          placeholder={t("emailPlaceholder")}
          aria-invalid={Boolean(state.fieldErrors?.email)}
          aria-describedby={
            state.fieldErrors?.email ? "email-error" : undefined
          }
          className={inputClassName}
        />
        {state.fieldErrors?.email && (
          <p id="email-error" className="text-xs text-destructive">
            {mapFieldError(state.fieldErrors.email)}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="context" className={labelClassName}>
          {t("context")}
        </label>
        <textarea
          id="context"
          name="context"
          rows={5}
          maxLength={5000}
          placeholder={t("contextPlaceholder")}
          className={`${inputClassName} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center bg-foreground text-background text-sm font-medium px-5 py-2.5 rounded-md hover:opacity-80 transition-opacity w-fit cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
