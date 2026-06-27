import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Personal and open-source projects — this section is under construction.",
};

export default function ProjectsPage() {
  return (
    <div className="px-6 py-20 content-width-wide">
      <div className="content-width">
        <p className="section-label">Projects</p>

        <h1 className="font-display font-bold text-4xl tracking-tight mb-4 mt-3">
          Under construction
        </h1>
        <p className="text-base text-muted-foreground max-w-[34rem] leading-relaxed mb-10">
          I&apos;m putting together a dedicated space for personal and
          open-source projects. Check back soon.
        </p>

        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View available case studies
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
