import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { DEFAULT_CONTENT_LOCALE, type Locale } from "@/content/locales";
import {
  personalProjectLocaleSchema,
  personalProjectMetaSchema,
  personalProjectSchema,
  type PersonalProject,
  type PersonalProjectHero,
  type PersonalProjectStatus,
} from "@/content/schemas";

export type { PersonalProject, PersonalProjectHero, PersonalProjectStatus };

const PROJECTS_CONTENT_DIR = path.join(process.cwd(), "content", "projects");

function listProjectSlugsFromFs(): string[] {
  if (!fs.existsSync(PROJECTS_CONTENT_DIR)) {
    throw new Error(
      `Projects content directory not found: ${PROJECTS_CONTENT_DIR}`,
    );
  }
  return fs
    .readdirSync(PROJECTS_CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function readMeta(slug: string) {
  const metaPath = path.join(PROJECTS_CONTENT_DIR, slug, "meta.json");
  if (!fs.existsSync(metaPath)) {
    throw new Error(`Missing meta.json for project entry: ${slug}`);
  }
  const raw = JSON.parse(fs.readFileSync(metaPath, "utf8")) as unknown;
  return personalProjectMetaSchema.parse(raw);
}

function readLocaleFrontmatter(slug: string, locale: Locale) {
  const mdxPath = path.join(PROJECTS_CONTENT_DIR, slug, `${locale}.mdx`);
  if (!fs.existsSync(mdxPath)) {
    throw new Error(`Missing ${locale}.mdx for project entry: ${slug}`);
  }
  const raw = fs.readFileSync(mdxPath, "utf8");
  const { data } = matter(raw);
  return personalProjectLocaleSchema.parse(data);
}

function applyEnvOverlay(
  slug: string,
  links: PersonalProject["links"],
): PersonalProject["links"] {
  const next = { ...links };

  const demoEnv: Record<string, string | undefined> = {
    quark: process.env.NEXT_PUBLIC_QUARK_DEMO_URL,
    passanota: process.env.NEXT_PUBLIC_PASSANOTA_DEMO_URL,
    drop: process.env.NEXT_PUBLIC_DROP_DEMO_URL,
    newsletter: process.env.NEXT_PUBLIC_NEWSLETTER_DEMO_URL,
  };

  if (slug in demoEnv) {
    const envValue = demoEnv[slug];
    if (envValue !== undefined) {
      if (envValue) next.demo = envValue;
      else delete next.demo;
    }
  }

  if (slug === "newsletter") {
    const githubEnv = process.env.NEXT_PUBLIC_NEWSLETTER_GITHUB_URL;
    if (githubEnv !== undefined) {
      if (githubEnv) next.github = githubEnv;
      else delete next.github;
    }
  }

  return next;
}

function loadProjectEntry(slug: string, locale: Locale): PersonalProject {
  const meta = readMeta(slug);
  if (meta.slug !== slug) {
    throw new Error(
      `Slug mismatch for ${slug}: meta.json has "${meta.slug}"`,
    );
  }
  const localeData = readLocaleFrontmatter(slug, locale);

  const hero =
    meta.heroVisual && localeData.heroLabel
      ? {
          label: localeData.heroLabel,
          accent: meta.heroVisual.accent,
          background: meta.heroVisual.background,
        }
      : undefined;

  const { heroLabel: _heroLabel, ...localeFields } = localeData;
  const { heroVisual: _heroVisual, ...metaFields } = meta;

  return personalProjectSchema.parse({
    ...metaFields,
    ...localeFields,
    links: applyEnvOverlay(slug, meta.links),
    hero,
  });
}

export function getAllProjects(
  locale: Locale = DEFAULT_CONTENT_LOCALE,
): PersonalProject[] {
  return listProjectSlugsFromFs()
    .map((slug) => loadProjectEntry(slug, locale))
    .sort((a, b) => a.order - b.order);
}

export function getProjectBySlug(
  slug: string,
  locale: Locale = DEFAULT_CONTENT_LOCALE,
): PersonalProject | undefined {
  const dir = path.join(PROJECTS_CONTENT_DIR, slug);
  if (!fs.existsSync(dir)) return undefined;
  return loadProjectEntry(slug, locale);
}

export function getFeaturedProjects(
  locale: Locale = DEFAULT_CONTENT_LOCALE,
): PersonalProject[] {
  return getAllProjects(locale).filter((p) => p.featured);
}

export function getProjectSlugs(): string[] {
  return listProjectSlugsFromFs()
    .map((slug) => readMeta(slug))
    .sort((a, b) => a.order - b.order)
    .map((m) => m.slug);
}
