import type { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Lucas for engineering projects, architecture consulting, or opportunities.",
};

export default function ContactPage() {
  return (
    <div className="px-6 py-20 content-width-wide">
      <div className="content-width">
        <p className="section-label">Contact</p>

        <h1 className="font-display font-bold text-4xl tracking-tight mb-4 mt-3">
          Let&apos;s talk.
        </h1>
        <p className="text-base text-muted-foreground max-w-[34rem] leading-relaxed mb-16">
          Available for backend engineering, cloud architecture, AI agents, and
          payment systems. Share what you are building and I will get back to
          you.
        </p>

        <ContactForm />

        <div className="mt-16 pt-10 border-t border-border">
          <p className="text-xs text-muted-foreground mb-4">
            Or reach me directly:
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="https://linkedin.com/in/lucas-caldas50"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              LinkedIn
            </Link>
            <Link
              href="https://github.com/lucastere10"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </Link>
            <Link
              href="mailto:lucasmedeiroscaldas@yahoo.com.br"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              lucasmedeiroscaldas@yahoo.com.br
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
