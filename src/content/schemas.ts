import { z } from "zod";

export const workDomainSchema = z.enum([
  "AI Agents",
  "Cloud Architecture",
  "Backend Engineering",
  "Payment Systems",
  "Data Engineering",
  "Computer Vision",
]);

export type Domain = z.infer<typeof workDomainSchema>;

export const metricSchema = z.object({
  label: z.coerce.string(),
  value: z.coerce.string(),
});

export const decisionSchema = z.object({
  title: z.string(),
  reasoning: z.string(),
});

/** Locale-agnostic work fields (meta.json). */
export const workMetaSchema = z.object({
  slug: z.string().min(1),
  domain: workDomainSchema,
  stack: z.array(z.string()).min(1),
  featured: z.boolean().optional(),
  order: z.number().int().nonnegative(),
});

/** Translatable frontmatter in pt-BR.mdx / en.mdx. */
export const workLocaleSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  impact: z.string(),
  context: z.string(),
  challenges: z.array(z.string()),
  decisions: z.array(decisionSchema),
  tradeoffs: z.string(),
  implementation: z.string(),
  learnings: z.array(z.string()),
  metrics: z.array(metricSchema).optional(),
});

/** Resolved work summary for list views. */
export const workSummarySchema = workMetaSchema.extend({
  name: z.string(),
  tagline: z.string(),
  impact: z.string(),
});

/** Full case study after locale resolution. */
export const workDetailSchema = workSummarySchema.extend({
  context: z.string(),
  challenges: z.array(z.string()),
  decisions: z.array(decisionSchema),
  tradeoffs: z.string(),
  implementation: z.string(),
  learnings: z.array(z.string()),
  metrics: z.array(metricSchema).optional(),
});

export type WorkMeta = z.infer<typeof workMetaSchema>;
export type WorkLocale = z.infer<typeof workLocaleSchema>;
export type WorkSummary = z.infer<typeof workSummarySchema>;
export type WorkDetail = z.infer<typeof workDetailSchema>;

export const personalProjectStatusSchema = z.enum([
  "live",
  "in-progress",
  "archived",
]);

export const personalProjectHeroSchema = z.object({
  label: z.string(),
  accent: z.string(),
  background: z.string(),
});

export const personalProjectHeroVisualSchema = z.object({
  accent: z.string(),
  background: z.string(),
});

export const personalProjectLinksSchema = z.object({
  demo: z.string().optional(),
  github: z.string().optional(),
  repo: z.string().optional(),
});

/** Locale-agnostic fields (meta.json). */
export const personalProjectMetaSchema = z.object({
  slug: z.string().min(1),
  domain: z.string(),
  stack: z.array(z.string()).min(1),
  status: personalProjectStatusSchema,
  featured: z.boolean().optional(),
  order: z.number().int().nonnegative(),
  links: personalProjectLinksSchema,
  heroVisual: personalProjectHeroVisualSchema.optional(),
});

/** Translatable frontmatter in pt-BR.mdx / en.mdx. */
export const personalProjectLocaleSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  overview: z.string(),
  highlights: z.array(z.string()),
  features: z.array(z.string()),
  technicalNotes: z.string(),
  metrics: z.array(metricSchema).optional(),
  learnings: z.array(z.string()).optional(),
  heroLabel: z.string().optional(),
});

/** Resolved personal project after locale merge. */
export const personalProjectSchema = z.object({
  slug: z.string().min(1),
  name: z.string(),
  domain: z.string(),
  tagline: z.string(),
  stack: z.array(z.string()).min(1),
  status: personalProjectStatusSchema,
  featured: z.boolean().optional(),
  order: z.number().int().nonnegative(),
  links: personalProjectLinksSchema,
  hero: personalProjectHeroSchema.optional(),
  overview: z.string(),
  highlights: z.array(z.string()),
  features: z.array(z.string()),
  technicalNotes: z.string(),
  metrics: z.array(metricSchema).optional(),
  learnings: z.array(z.string()).optional(),
});

export type PersonalProjectMeta = z.infer<typeof personalProjectMetaSchema>;
export type PersonalProjectLocale = z.infer<typeof personalProjectLocaleSchema>;
export type PersonalProject = z.infer<typeof personalProjectSchema>;
export type PersonalProjectStatus = z.infer<typeof personalProjectStatusSchema>;
export type PersonalProjectHero = z.infer<typeof personalProjectHeroSchema>;

export const labDomainSchema = z.enum([
  "CI/CD",
  "AI Agents & Automation",
  "Cloud Architecture / GCP",
  "MLOps & Data Pipelines",
]);

export type LabDomain = z.infer<typeof labDomainSchema>;

export const LAB_DOMAIN_ORDER: LabDomain[] = [
  "CI/CD",
  "AI Agents & Automation",
  "Cloud Architecture / GCP",
  "MLOps & Data Pipelines",
];

/** Locale-agnostic fields (meta.json). */
export const labMetaSchema = z.object({
  slug: z.string().min(1),
  domain: labDomainSchema,
  tags: z.array(z.string()),
  order: z.number().int().nonnegative(),
  demoKey: z.string().min(1),
});

/** Translatable frontmatter in pt-BR.mdx / en.mdx. */
export const labLocaleSchema = z.object({
  title: z.string(),
  summary: z.string(),
  interactionPrompt: z.string(),
  narrative: z.tuple([z.string(), z.string(), z.string(), z.string()]),
  demonstrates: z.array(z.string()),
});

/** Resolved lab after locale merge. */
export const labDefinitionSchema = z.object({
  slug: z.string().min(1),
  title: z.string(),
  domain: labDomainSchema,
  summary: z.string(),
  interactionPrompt: z.string(),
  narrative: z.tuple([z.string(), z.string(), z.string(), z.string()]),
  demonstrates: z.array(z.string()),
  tags: z.array(z.string()),
  order: z.number().int().nonnegative(),
  demoKey: z.string().min(1),
});

export type LabMeta = z.infer<typeof labMetaSchema>;
export type LabLocale = z.infer<typeof labLocaleSchema>;
export type LabDefinition = z.infer<typeof labDefinitionSchema>;

export const pageDomainSchema = z.object({
  title: z.string(),
  description: z.string(),
  /** Internal path to a concrete case or lab (no locale prefix). */
  proofHref: z.string().min(1),
});

export type PageDomain = z.infer<typeof pageDomainSchema>;

export const homePageSchema = z.object({
  domains: z.array(pageDomainSchema).min(1),
  labsTitle: z.string(),
  labsBody: z.string(),
  featuredLabSlugs: z.array(z.string().min(1)).length(3),
  aboutBlurb: z.string(),
  ctaTitle: z.string(),
  ctaBody: z.string(),
});

export type HomePage = z.infer<typeof homePageSchema>;

export const aboutFocusAreaSchema = z.object({
  title: z.string(),
  detail: z.string(),
});

export const aboutPageSchema = z.object({
  title: z.string(),
  intro: z.array(z.string()).min(1),
  focusAreas: z.array(aboutFocusAreaSchema).min(1),
  metaDescription: z.string().optional(),
});

export type AboutPage = z.infer<typeof aboutPageSchema>;

export const contactPageSchema = z.object({
  title: z.string(),
  headline: z.string(),
  intro: z.string(),
  directReachLabel: z.string(),
  email: z.string(),
  metaDescription: z.string().optional(),
});

export type ContactPage = z.infer<typeof contactPageSchema>;
