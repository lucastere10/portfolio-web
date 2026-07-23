import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { DEFAULT_CONTENT_LOCALE, type Locale } from "@/content/locales";
import {
  workDetailSchema,
  workLocaleSchema,
  workMetaSchema,
  workSummarySchema,
  type Domain,
  type WorkDetail,
  type WorkSummary,
} from "@/content/schemas";

export type { Domain, WorkDetail, WorkSummary };

const WORK_CONTENT_DIR = path.join(process.cwd(), "content", "work");

function listWorkSlugsFromFs(): string[] {
  if (!fs.existsSync(WORK_CONTENT_DIR)) {
    throw new Error(`Work content directory not found: ${WORK_CONTENT_DIR}`);
  }
  return fs
    .readdirSync(WORK_CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function readMeta(slug: string) {
  const metaPath = path.join(WORK_CONTENT_DIR, slug, "meta.json");
  if (!fs.existsSync(metaPath)) {
    throw new Error(`Missing meta.json for work entry: ${slug}`);
  }
  const raw = JSON.parse(fs.readFileSync(metaPath, "utf8")) as unknown;
  return workMetaSchema.parse(raw);
}

function readLocaleFrontmatter(slug: string, locale: Locale) {
  const mdxPath = path.join(WORK_CONTENT_DIR, slug, `${locale}.mdx`);
  if (!fs.existsSync(mdxPath)) {
    throw new Error(`Missing ${locale}.mdx for work entry: ${slug}`);
  }
  const raw = fs.readFileSync(mdxPath, "utf8");
  const { data } = matter(raw);
  return workLocaleSchema.parse(data);
}

function loadWorkEntry(slug: string, locale: Locale): WorkDetail {
  const meta = readMeta(slug);
  if (meta.slug !== slug) {
    throw new Error(
      `Slug mismatch for ${slug}: meta.json has "${meta.slug}"`,
    );
  }
  const localeData = readLocaleFrontmatter(slug, locale);
  return workDetailSchema.parse({
    ...meta,
    ...localeData,
  });
}

export function getAllWork(
  locale: Locale = DEFAULT_CONTENT_LOCALE,
): WorkSummary[] {
  const entries = listWorkSlugsFromFs()
    .map((slug) => loadWorkEntry(slug, locale))
    .sort((a, b) => a.order - b.order);

  return entries.map((entry) =>
    workSummarySchema.parse({
      slug: entry.slug,
      domain: entry.domain,
      stack: entry.stack,
      featured: entry.featured,
      order: entry.order,
      name: entry.name,
      tagline: entry.tagline,
      impact: entry.impact,
    }),
  );
}

export function getWorkBySlug(
  slug: string,
  locale: Locale = DEFAULT_CONTENT_LOCALE,
): WorkDetail | undefined {
  const dir = path.join(WORK_CONTENT_DIR, slug);
  if (!fs.existsSync(dir)) return undefined;
  return loadWorkEntry(slug, locale);
}

export function getFeaturedWork(
  locale: Locale = DEFAULT_CONTENT_LOCALE,
): WorkSummary[] {
  return getAllWork(locale).filter((w) => w.featured);
}

export function getWorkSlugs(): string[] {
  return listWorkSlugsFromFs()
    .map((slug) => readMeta(slug))
    .sort((a, b) => a.order - b.order)
    .map((m) => m.slug);
}

export const WORK_DOMAINS: Domain[] = [
  "AI Agents",
  "Cloud Architecture",
  "Backend Engineering",
  "Payment Systems",
  "Data Engineering",
  "Computer Vision",
];
