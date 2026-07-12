import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { personalProjects } from "@/lib/personal-projects";
import { LABS } from "@/lib/labs";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://lucas.dev"; // replace with real domain

  const staticRoutes = ["/", "/work", "/projects", "/labs", "/about", "/contact"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.8,
    }),
  );

  const workRoutes = projects.map((p) => ({
    url: `${base}/work/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const personalRoutes = personalProjects.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const labRoutes = LABS.map((lab) => ({
    url: `${base}/labs/${lab.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...workRoutes, ...personalRoutes, ...labRoutes];
}
