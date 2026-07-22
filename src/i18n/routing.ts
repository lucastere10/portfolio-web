import { defineRouting } from "next-intl/routing";
import { locales } from "@/content/locales";

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale: "pt-BR",
  localePrefix: "as-needed",
  localeDetection: false,
});
