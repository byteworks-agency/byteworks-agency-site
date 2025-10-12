import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://byteworks.agency"; // cambia si es otro dominio
  const routes = [
    "", "/plans", "/about", "/contact", "/privacy", "/terms",
    "/es", "/es/plans", "/es/about", "/es/contact", "/es/privacy", "/es/terms",
  ];
  const now = new Date().toISOString();
  return routes.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p === "" || p === "/es" ? 1.0 : 0.7,
  }));
}