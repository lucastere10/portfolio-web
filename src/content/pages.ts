import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { DEFAULT_CONTENT_LOCALE, type Locale } from "@/content/locales";
import {
  aboutPageSchema,
  contactPageSchema,
  homePageSchema,
  type AboutPage,
  type ContactPage,
  type HomePage,
  type PageDomain,
} from "@/content/schemas";

export type { AboutPage, ContactPage, HomePage, PageDomain };

const PAGES_CONTENT_DIR = path.join(process.cwd(), "content", "pages");

function readPageFrontmatter(page: string, locale: Locale): unknown {
  const mdxPath = path.join(PAGES_CONTENT_DIR, page, `${locale}.mdx`);
  if (!fs.existsSync(mdxPath)) {
    throw new Error(`Missing ${locale}.mdx for page: ${page}`);
  }
  const raw = fs.readFileSync(mdxPath, "utf8");
  const { data } = matter(raw);
  return data;
}

export function getHomePage(
  locale: Locale = DEFAULT_CONTENT_LOCALE,
): HomePage {
  return homePageSchema.parse(readPageFrontmatter("home", locale));
}

export function getDomains(
  locale: Locale = DEFAULT_CONTENT_LOCALE,
): PageDomain[] {
  return getHomePage(locale).domains;
}

export function getAboutPage(
  locale: Locale = DEFAULT_CONTENT_LOCALE,
): AboutPage {
  return aboutPageSchema.parse(readPageFrontmatter("about", locale));
}

export function getContactPage(
  locale: Locale = DEFAULT_CONTENT_LOCALE,
): ContactPage {
  return contactPageSchema.parse(readPageFrontmatter("contact", locale));
}
