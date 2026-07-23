export const locales = ["pt-BR", "en"] as const;

export type Locale = (typeof locales)[number];

/** Default matches URL defaultLocale (pt-BR unprefixed). */
export const DEFAULT_CONTENT_LOCALE: Locale = "pt-BR";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Resolve a route `locale` param; fall back to default content locale. */
export function resolveLocaleParam(value: string): Locale {
  return isLocale(value) ? value : DEFAULT_CONTENT_LOCALE;
}
