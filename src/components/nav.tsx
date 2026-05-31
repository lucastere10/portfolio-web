"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M12 .5A12 12 0 0 0 8.2 23.9c.6.1.8-.3.8-.6v-2.2c-3.4.7-4.1-1.5-4.1-1.5-.6-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.4 1 .1-.8.4-1.3.7-1.7-2.7-.3-5.6-1.3-5.6-6 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11 11 0 0 1 6 0C17 5 18 5.3 18 5.3c.6 1.6.2 2.9.1 3.2.8.9 1.2 2 1.2 3.3 0 4.7-2.9 5.7-5.7 6 .5.4.8 1.1.8 2.3v3.3c0 .4.2.7.8.6A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M20.4 20.4h-3.6v-5.7c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3v5.8H9.1V9h3.4v1.6h.1c.5-.9 1.6-1.9 3.4-1.9 3.7 0 4.4 2.4 4.4 5.6v6.1ZM5 7.4a2.1 2.1 0 1 1 0-4.3 2.1 2.1 0 0 1 0 4.3Zm1.8 13H3.2V9h3.6v11.4Z" />
    </svg>
  );
}

const links = [
  { href: "/work", label: "Work" },
  { href: "/labs", label: "Labs" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="content-width-wide px-6">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Wordmark */}
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-[var(--gold)]"
          >
            Lucas Caldas
          </Link>

          <div className="flex items-center gap-3">
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {links.map(({ href, label }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`relative text-sm transition-colors ${
                      active
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {label}
                    {active && (
                      <span
                        className="absolute -bottom-[1px] left-0 right-0 h-[1px]"
                        style={{ backgroundColor: "var(--gold)" }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-1.5">
              <Link
                href="https://github.com/lucastere10"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex h-9 w-9 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:text-foreground hover:border-foreground"
              >
                <GitHubIcon />
              </Link>
              <Link
                href="https://linkedin.com/in/lucas-caldas50"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-9 w-9 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:text-foreground hover:border-foreground"
              >
                <LinkedInIcon />
              </Link>
            </div>

            <button
              type="button"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex h-9 w-9 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:text-foreground hover:border-foreground"
            >
              <Sun className="h-4 w-4 dark:hidden" />
              <Moon className="hidden h-4 w-4 dark:block" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
