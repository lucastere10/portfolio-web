"use server";

import { headers } from "next/headers";

import { isContactRateLimited } from "@/lib/agent-rate-limit";
import {
  sendContactEmail,
  validateContactPayload,
  type ContactFormState,
} from "@/lib/contact";

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const honeypot = formData.get("company");
  if (typeof honeypot === "string" && honeypot.trim()) {
    return { ok: true };
  }

  const headerList = await headers();
  const req = new Request("http://localhost", { headers: headerList });

  if (isContactRateLimited(req)) {
    return {
      ok: false,
      error: "Too many requests. Please try again in a minute.",
    };
  }

  const result = validateContactPayload({
    name: formData.get("name"),
    email: formData.get("email"),
    context: formData.get("context"),
  });

  if (!result.ok) {
    return {
      ok: false,
      error: result.error,
      fieldErrors: result.fieldErrors,
    };
  }

  try {
    await sendContactEmail(result.data);
    return { ok: true };
  } catch (err) {
    console.error("Contact form failed:", err);
    return {
      ok: false,
      error:
        "Could not send your message. Please try again or email me directly.",
    };
  }
}
