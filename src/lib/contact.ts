import { Resend } from "resend";

export type ContactFieldErrors = {
  name?: string;
  email?: string;
  context?: string;
};

export type ContactPayload = {
  name: string;
  email: string;
  context: string;
};

export type ContactFormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: ContactFieldErrors;
};

const NAME_MAX = 100;
const EMAIL_MAX = 254;
const CONTEXT_MAX = 5000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactPayload(raw: {
  name: unknown;
  email: unknown;
  context: unknown;
}):
  | { ok: true; data: ContactPayload }
  | { ok: false; error: string; fieldErrors: ContactFieldErrors } {
  const fieldErrors: ContactFieldErrors = {};

  const name =
    typeof raw.name === "string" ? raw.name.trim().slice(0, NAME_MAX) : "";
  const email =
    typeof raw.email === "string" ? raw.email.trim().slice(0, EMAIL_MAX) : "";
  const context =
    typeof raw.context === "string"
      ? raw.context.trim().slice(0, CONTEXT_MAX)
      : "";

  if (!name) {
    fieldErrors.name = "Name is required.";
  }

  if (!email) {
    fieldErrors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors,
    };
  }

  return { ok: true, data: { name, email, context } };
}

export async function sendContactEmail(data: ContactPayload): Promise<void> {
  const apiKey = process.env["RESEND_API_KEY"];
  const from = process.env["CONTACT_FROM_EMAIL"];
  const to = process.env["CONTACT_TO_EMAIL"];

  if (!apiKey || !from || !to) {
    const missing = [
      !apiKey && "RESEND_API_KEY",
      !from && "CONTACT_FROM_EMAIL",
      !to && "CONTACT_TO_EMAIL",
    ].filter(Boolean);
    throw new Error(`Contact email is not configured (missing: ${missing.join(", ")})`);
  }

  const resend = new Resend(apiKey);
  const text = [
    "New contact form submission",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    "",
    data.context ? `Message:\n${data.context}` : "(No message provided)",
  ].join("\n");

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: data.email,
    subject: `Portfolio contact from ${data.name}`,
    text,
  });

  if (error) {
    throw new Error(error.message);
  }
}
