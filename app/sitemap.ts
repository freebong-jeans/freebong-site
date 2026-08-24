import type { MetadataRoute } from "next";
import { MOCK_PRODUCTS } from "@/lib/mockProducts";

const BASE = "https://fbg-jeans.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                            lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/colecao`,               lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/movimento`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/parceiros`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/revendedores`,          lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/conta`,                 lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/privacidade`,           lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
    { url: `${BASE}/termos`,                lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
  ];

  const productRoutes: MetadataRoute.Sitemap = MOCK_PRODUCTS.map((p) => ({
    url: `${BASE}/produtos/${p.handle}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
