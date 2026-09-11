import type { MetadataRoute } from "next";
import { fetchAllProducts } from "@/lib/shopifyProducts";

const BASE = "https://www.freebong.com.br";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  /* As paginas de produto vem da Shopify. Antes o sitemap listava uma lista
     fixa de pecas que nao existiam na loja, mandando o Google para 404. */
  try {
    const produtos = await fetchAllProducts();
    const productRoutes: MetadataRoute.Sitemap = produtos.map((p) => ({
      url: `${BASE}/produtos/${p.handle}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
    return [...staticRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
