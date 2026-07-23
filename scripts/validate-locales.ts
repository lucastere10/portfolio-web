/**
 * Dual-locale content + messages key parity validator.
 * Fails the process if any content entry lacks en/pt-BR or messages diverge.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import {
  aboutPageSchema,
  contactPageSchema,
  homePageSchema,
  labLocaleSchema,
  labMetaSchema,
  personalProjectLocaleSchema,
  personalProjectMetaSchema,
  workLocaleSchema,
  workMetaSchema,
} from "../src/content/schemas";
import { locales } from "../src/content/locales";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "content");
const MESSAGES = path.join(ROOT, "messages");

type Issue = string;

function listDirs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

function readJson(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
}

function readFrontmatter(filePath: string): unknown {
  const raw = fs.readFileSync(filePath, "utf8");
  return matter(raw).data;
}

export function deepKeys(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return prefix ? [prefix] : [];
  }
  const obj = value as Record<string, unknown>;
  return Object.keys(obj)
    .sort()
    .flatMap((key) => {
      const next = prefix ? `${prefix}.${key}` : key;
      const child = obj[key];
      if (child !== null && typeof child === "object" && !Array.isArray(child)) {
        return deepKeys(child, next);
      }
      return [next];
    });
}

/** Exported for unit tests. */
export function collectMessageKeyParityIssues(
  en: unknown,
  pt: unknown,
): Issue[] {
  const issues: Issue[] = [];
  const enKeys = deepKeys(en);
  const ptKeys = deepKeys(pt);
  const enSet = new Set(enKeys);
  const ptSet = new Set(ptKeys);
  for (const key of enKeys) {
    if (!ptSet.has(key)) issues.push(`pt missing: ${key}`);
  }
  for (const key of ptKeys) {
    if (!enSet.has(key)) issues.push(`en missing: ${key}`);
  }
  return issues;
}

function validateMessageParity(issues: Issue[]) {
  const enPath = path.join(MESSAGES, "en.json");
  const ptPath = path.join(MESSAGES, "pt-BR.json");
  if (!fs.existsSync(enPath)) issues.push(`Missing ${enPath}`);
  if (!fs.existsSync(ptPath)) issues.push(`Missing ${ptPath}`);
  if (!fs.existsSync(enPath) || !fs.existsSync(ptPath)) return;

  issues.push(
    ...collectMessageKeyParityIssues(readJson(enPath), readJson(ptPath)).map(
      (msg) => `messages: ${msg}`,
    ),
  );
}

function validateWork(issues: Issue[]) {
  const base = path.join(CONTENT, "work");
  for (const slug of listDirs(base)) {
    const dir = path.join(base, slug);
    const metaPath = path.join(dir, "meta.json");
    if (!fs.existsSync(metaPath)) {
      issues.push(`work/${slug}: missing meta.json`);
      continue;
    }
    const metaResult = workMetaSchema.safeParse(readJson(metaPath));
    if (!metaResult.success) {
      issues.push(`work/${slug}/meta.json: ${metaResult.error.message}`);
    } else if (metaResult.data.slug !== slug) {
      issues.push(
        `work/${slug}: meta.slug "${metaResult.data.slug}" !== folder`,
      );
    }

    for (const locale of locales) {
      const mdxPath = path.join(dir, `${locale}.mdx`);
      if (!fs.existsSync(mdxPath)) {
        issues.push(`work/${slug}: missing ${locale}.mdx`);
        continue;
      }
      const parsed = workLocaleSchema.safeParse(readFrontmatter(mdxPath));
      if (!parsed.success) {
        issues.push(`work/${slug}/${locale}.mdx: ${parsed.error.message}`);
      }
    }
  }
}

function validateProjects(issues: Issue[]) {
  const base = path.join(CONTENT, "projects");
  for (const slug of listDirs(base)) {
    const dir = path.join(base, slug);
    const metaPath = path.join(dir, "meta.json");
    if (!fs.existsSync(metaPath)) {
      issues.push(`projects/${slug}: missing meta.json`);
      continue;
    }
    const metaResult = personalProjectMetaSchema.safeParse(readJson(metaPath));
    if (!metaResult.success) {
      issues.push(`projects/${slug}/meta.json: ${metaResult.error.message}`);
    } else if (metaResult.data.slug !== slug) {
      issues.push(
        `projects/${slug}: meta.slug "${metaResult.data.slug}" !== folder`,
      );
    }

    for (const locale of locales) {
      const mdxPath = path.join(dir, `${locale}.mdx`);
      if (!fs.existsSync(mdxPath)) {
        issues.push(`projects/${slug}: missing ${locale}.mdx`);
        continue;
      }
      const parsed = personalProjectLocaleSchema.safeParse(
        readFrontmatter(mdxPath),
      );
      if (!parsed.success) {
        issues.push(`projects/${slug}/${locale}.mdx: ${parsed.error.message}`);
      }
    }
  }
}

function validateLabs(issues: Issue[]) {
  const base = path.join(CONTENT, "labs");
  for (const slug of listDirs(base)) {
    const dir = path.join(base, slug);
    const metaPath = path.join(dir, "meta.json");
    if (!fs.existsSync(metaPath)) {
      issues.push(`labs/${slug}: missing meta.json`);
      continue;
    }
    const metaResult = labMetaSchema.safeParse(readJson(metaPath));
    if (!metaResult.success) {
      issues.push(`labs/${slug}/meta.json: ${metaResult.error.message}`);
    } else if (metaResult.data.slug !== slug) {
      issues.push(
        `labs/${slug}: meta.slug "${metaResult.data.slug}" !== folder`,
      );
    }

    for (const locale of locales) {
      const mdxPath = path.join(dir, `${locale}.mdx`);
      if (!fs.existsSync(mdxPath)) {
        issues.push(`labs/${slug}: missing ${locale}.mdx`);
        continue;
      }
      const parsed = labLocaleSchema.safeParse(readFrontmatter(mdxPath));
      if (!parsed.success) {
        issues.push(`labs/${slug}/${locale}.mdx: ${parsed.error.message}`);
      }
    }
  }
}

const pageSchemas = {
  home: homePageSchema,
  about: aboutPageSchema,
  contact: contactPageSchema,
} as const;

function validatePages(issues: Issue[]) {
  const base = path.join(CONTENT, "pages");
  for (const page of listDirs(base)) {
    const schema = pageSchemas[page as keyof typeof pageSchemas];
    if (!schema) {
      issues.push(`pages/${page}: unknown page (no schema)`);
      continue;
    }
    for (const locale of locales) {
      const mdxPath = path.join(base, page, `${locale}.mdx`);
      if (!fs.existsSync(mdxPath)) {
        issues.push(`pages/${page}: missing ${locale}.mdx`);
        continue;
      }
      const parsed = schema.safeParse(readFrontmatter(mdxPath));
      if (!parsed.success) {
        issues.push(`pages/${page}/${locale}.mdx: ${parsed.error.message}`);
      }
    }
  }
}

export function validateLocales(): Issue[] {
  const issues: Issue[] = [];
  validateMessageParity(issues);
  validateWork(issues);
  validateProjects(issues);
  validateLabs(issues);
  validatePages(issues);
  return issues;
}

function main() {
  const issues = validateLocales();
  if (issues.length > 0) {
    console.error(`validate:locales failed (${issues.length} issue(s)):\n`);
    for (const issue of issues) console.error(`  - ${issue}`);
    process.exit(1);
  }
  console.log("validate:locales OK — dual locales + message key parity.");
}

const entry = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (entry === path.resolve(fileURLToPath(import.meta.url))) {
  main();
}
