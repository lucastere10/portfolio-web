import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Lucas for engineering projects, architecture consulting, or opportunities.",
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
          Available for backend engineering, cloud architecture, AI agents, and payment systems. Share what you are building and I will get back to you.
        </p>

        <form
          action="mailto:lucasmedeiroscaldas@yahoo.com.br"
          method="POST"
          className="flex flex-col gap-6 max-w-lg"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-mono text-xs font-medium tracking-widest uppercase text-muted-foreground"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Your name"
              className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-mono text-xs font-medium tracking-widest uppercase text-muted-foreground"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@company.com"
              className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="context"
              className="text-mono text-xs font-medium tracking-widest uppercase text-muted-foreground"
            >
              Project context
            </label>
            <textarea
              id="context"
              name="context"
              rows={5}
              placeholder="Describe what you are building, what kind of help you need, and any relevant constraints."
              className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-shadow resize-none"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center bg-foreground text-background text-sm font-medium px-5 py-2.5 rounded-md hover:opacity-80 transition-opacity w-fit"
          >
            Send message
          </button>
        </form>

        <div className="mt-16 pt-10 border-t border-border">
          <p className="text-xs text-muted-foreground mb-4">Or reach me directly:</p>
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
