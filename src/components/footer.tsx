"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="content-width-wide px-6 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Left */}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-foreground">
              Lucas Caldas
            </span>
            <span className="text-xs text-muted-foreground">
              Software Engineer · AI &amp; Cloud · Rio de Janeiro, Brazil
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link
              href="https://github.com/lucastere10"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </Link>
            <Link
              href="https://linkedin.com/in/lucas-caldas50"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              LinkedIn
            </Link>
            <Link
              href="/contact"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
