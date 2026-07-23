import type { Locale } from "@/content/locales";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";

/** Normalize to a path starting with `/` (or `/` for empty). */
export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

/**
 * Locale-prefixed path for `as-needed` routing:
 * pt-BR → `/work`, en → `/en/work`.
 */
export function localizedPath(locale: string, pathname: string): string {
  const path = normalizePathname(pathname);
  if (locale === routing.defaultLocale) {
    return path;
  }
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export function absoluteUrl(locale: string, pathname: string): string {
  return `${SITE_URL}${localizedPath(locale, pathname)}`;
}

/** hreflang map: pt-BR, en, and x-default → pt-BR. */
export function languageAlternates(
  pathname: string,
): Record<string, string> {
  const path = normalizePathname(pathname);
  const alternates: Record<string, string> = {};
  for (const locale of routing.locales) {
    alternates[locale] = absoluteUrl(locale, path);
  }
  alternates["x-default"] = absoluteUrl(routing.defaultLocale, path);
  return alternates;
}

export function pageAlternates(locale: string, pathname: string) {
  return {
    canonical: absoluteUrl(locale, pathname),
    languages: languageAlternates(pathname),
  };
}

/** Per-page Open Graph block (url + title + description + locale). */
export function ogForPath(
  locale: string,
  pathname: string,
  {
    title,
    description,
  }: {
    title: string;
    description: string;
  },
) {
  return {
    title,
    description,
    url: absoluteUrl(locale, pathname),
    locale: locale === "pt-BR" ? "pt_BR" : "en_US",
  };
}

export function isContentLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}
