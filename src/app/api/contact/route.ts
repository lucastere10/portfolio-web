import { NextRequest, NextResponse } from "next/server";

import { isContactRateLimited } from "@/lib/agent-rate-limit";
import { sendContactEmail, validateContactPayload } from "@/lib/contact";

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (isContactRateLimited(req)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a minute." },
      { status: 429 },
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid form submission." },
      { status: 400 },
    );
  }

  const honeypot = formData.get("company");
  if (typeof honeypot === "string" && honeypot.trim()) {
    return NextResponse.json({ ok: true });
  }

  const result = validateContactPayload({
    name: formData.get("name"),
    email: formData.get("email"),
    context: formData.get("context"),
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: result.error,
        fieldErrors: result.fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    await sendContactEmail(result.data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form failed:", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Could not send your message. Please try again or email me directly.",
      },
      { status: 502 },
    );
  }
}
