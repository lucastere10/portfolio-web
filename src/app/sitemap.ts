import type { MetadataRoute } from "next";
import { getWorkSlugs } from "@/content/work";
import { getProjectSlugs } from "@/content/projects";
import { getLabSlugs } from "@/content/labs";
import { routing } from "@/i18n/routing";
import { absoluteUrl, languageAlternates } from "@/i18n/seo";

function entriesForPath(pathname: string, priority: number): MetadataRoute.Sitemap {
  const languages = languageAlternates(pathname);
  return routing.locales.map((locale) => ({
    url: absoluteUrl(locale, pathname),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority,
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths: Array<{ path: string; priority: number }> = [
    { path: "/", priority: 1 },
    { path: "/work", priority: 0.8 },
    { path: "/projects", priority: 0.8 },
    { path: "/labs", priority: 0.8 },
    { path: "/about", priority: 0.8 },
    { path: "/contact", priority: 0.8 },
  ];

  const slugPaths = [
    ...getWorkSlugs().map((slug) => `/work/${slug}`),
    ...getProjectSlugs().map((slug) => `/projects/${slug}`),
    ...getLabSlugs().map((slug) => `/labs/${slug}`),
  ];

  return [
    ...staticPaths.flatMap(({ path, priority }) =>
      entriesForPath(path, priority),
    ),
    ...slugPaths.flatMap((path) => entriesForPath(path, 0.7)),
  ];
}
