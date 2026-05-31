import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://lucas.dev"; // replace with real domain

  const staticRoutes = ["/", "/work", "/labs", "/about", "/contact"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.8,
    })
  );

  const projectSlugs = [
    "agentic-rag-pipeline",
    "mlops-platform",
    "event-driven-architecture",
    "data-pipeline-orchestration",
    "integration-hub",
  ];

  const projectRoutes = projectSlugs.map((slug) => ({
    url: `${base}/work/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
