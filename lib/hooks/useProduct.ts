"use client";

import { useState, useEffect } from "react";
import { getShopifyClient } from "@/lib/shopifyClient";
import { MOCK_PRODUCTS } from "@/lib/mockProducts";
import type { ShopifyProduct } from "@/lib/hooks/useProducts";

interface UseProductResult {
  product: ShopifyProduct | null;
  loading: boolean;
  error: Error | null;
}

export function useProduct(handle: string): UseProductResult {
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!handle) return;
    let cancelled = false;

    async function fetch() {
      try {
        const client = getShopifyClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw = await client.product.fetchByHandle(handle) as unknown as any;
        if (!cancelled) {
          if (raw) {
            // Normaliza price de objeto para string (shopify-buy v3)
            const normalized: ShopifyProduct = {
              id: String(raw.id ?? ""),
              title: raw.title ?? "",
              handle: raw.handle ?? "",
              description: raw.description ?? "",
              descriptionHtml: raw.descriptionHtml ?? "",
              productType: raw.productType ?? "",
              tags: Array.isArray(raw.tags) ? raw.tags : [],
              images: (raw.images ?? []).map((img: any) => ({ id: String(img.id ?? ""), src: img.src ?? "", altText: img.altText ?? null })), // eslint-disable-line @typescript-eslint/no-explicit-any
              variants: (raw.variants ?? []).map((v: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
                id: String(v.id ?? ""),
                title: v.title ?? "",
                price: typeof v.price === "object" && v.price !== null ? String(v.price.amount ?? "0") : String(v.price ?? "0"),
                available: Boolean(v.available),
                image: v.image ? { id: String(v.image.id ?? ""), src: v.image.src ?? "", altText: v.image.altText ?? null } : null,
              })),
            };
            setProduct(normalized);
          } else {
            setProduct(MOCK_PRODUCTS.find(p => p.handle === handle) ?? null);
          }
        }
      } catch {
        if (!cancelled) {
          setProduct(MOCK_PRODUCTS.find(p => p.handle === handle) ?? null);
          setError(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [handle]);

  return { product, loading, error };
}
