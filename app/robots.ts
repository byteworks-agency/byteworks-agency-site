import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://byteworks.agency"; // cambia si usas otro dominio
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/"] },
    sitemap: `${base}/sitemap.xml`,
  };
}