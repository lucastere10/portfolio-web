import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { DEFAULT_CONTENT_LOCALE, type Locale } from "@/content/locales";
import {
  LAB_DOMAIN_ORDER,
  labDefinitionSchema,
  labLocaleSchema,
  labMetaSchema,
  type LabDefinition,
  type LabDomain,
} from "@/content/schemas";

export type { LabDefinition, LabDomain };
export { LAB_DOMAIN_ORDER };

const LABS_CONTENT_DIR = path.join(process.cwd(), "content", "labs");

function listLabSlugsFromFs(): string[] {
  if (!fs.existsSync(LABS_CONTENT_DIR)) {
    throw new Error(`Labs content directory not found: ${LABS_CONTENT_DIR}`);
  }
  return fs
    .readdirSync(LABS_CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function readMeta(slug: string) {
  const metaPath = path.join(LABS_CONTENT_DIR, slug, "meta.json");
  if (!fs.existsSync(metaPath)) {
    throw new Error(`Missing meta.json for lab entry: ${slug}`);
  }
  const raw = JSON.parse(fs.readFileSync(metaPath, "utf8")) as unknown;
  return labMetaSchema.parse(raw);
}

function readLocaleFrontmatter(slug: string, locale: Locale) {
  const mdxPath = path.join(LABS_CONTENT_DIR, slug, `${locale}.mdx`);
  if (!fs.existsSync(mdxPath)) {
    throw new Error(`Missing ${locale}.mdx for lab entry: ${slug}`);
  }
  const raw = fs.readFileSync(mdxPath, "utf8");
  const { data } = matter(raw);
  return labLocaleSchema.parse(data);
}

function loadLabEntry(slug: string, locale: Locale): LabDefinition {
  const meta = readMeta(slug);
  if (meta.slug !== slug) {
    throw new Error(
      `Slug mismatch for ${slug}: meta.json has "${meta.slug}"`,
    );
  }
  const localeData = readLocaleFrontmatter(slug, locale);
  return labDefinitionSchema.parse({
    ...meta,
    ...localeData,
  });
}

export function getAllLabs(
  locale: Locale = DEFAULT_CONTENT_LOCALE,
): LabDefinition[] {
  return listLabSlugsFromFs()
    .map((slug) => loadLabEntry(slug, locale))
    .sort((a, b) => a.order - b.order);
}

export function getLabBySlug(
  slug: string,
  locale: Locale = DEFAULT_CONTENT_LOCALE,
): LabDefinition | undefined {
  const dir = path.join(LABS_CONTENT_DIR, slug);
  if (!fs.existsSync(dir)) return undefined;
  return loadLabEntry(slug, locale);
}

export function getLabsByDomain(
  locale: Locale = DEFAULT_CONTENT_LOCALE,
): { domain: LabDomain; labs: LabDefinition[] }[] {
  const labs = getAllLabs(locale);
  return LAB_DOMAIN_ORDER.map((domain) => ({
    domain,
    labs: labs
      .filter((lab) => lab.domain === domain)
      .sort((a, b) => a.order - b.order),
  }));
}

export function getLabSlugs(): string[] {
  return listLabSlugsFromFs()
    .map((slug) => readMeta(slug))
    .sort((a, b) => a.order - b.order)
    .map((m) => m.slug);
}
