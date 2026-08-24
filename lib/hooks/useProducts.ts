"use client";

import { useState, useEffect } from "react";
import { getShopifyClient } from "@/lib/shopifyClient";
import { MOCK_PRODUCTS } from "@/lib/mockProducts";

export interface ShopifyImage {
  id: string;
  src: string;
  altText: string | null;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: string;
  available: boolean;
  image: ShopifyImage | null;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  tags: string[];
  images: ShopifyImage[];
  variants: ShopifyProductVariant[];
}

interface UseProductsResult {
  products: ShopifyProduct[];
  loading: boolean;
  error: Error | null;
}

// Normaliza o retorno do shopify-buy para o formato interno
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeProduct(raw: any): ShopifyProduct {
  return {
    id: String(raw.id ?? ""),
    title: raw.title ?? "",
    handle: raw.handle ?? "",
    description: raw.description ?? "",
    descriptionHtml: raw.descriptionHtml ?? "",
    productType: raw.productType ?? "",
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    images: (raw.images ?? []).map((img: any) => ({  // eslint-disable-line @typescript-eslint/no-explicit-any
      id: String(img.id ?? ""),
      src: img.src ?? "",
      altText: img.altText ?? null,
    })),
    variants: (raw.variants ?? []).map((v: any) => ({  // eslint-disable-line @typescript-eslint/no-explicit-any
      id: String(v.id ?? ""),
      title: v.title ?? "",
      // shopify-buy v3 retorna price como objeto {amount, currencyCode}
      price: typeof v.price === "object" && v.price !== null
        ? String(v.price.amount ?? "0")
        : String(v.price ?? "0"),
      available: Boolean(v.available),
      image: v.image
        ? { id: String(v.image.id ?? ""), src: v.image.src ?? "", altText: v.image.altText ?? null }
        : null,
    })),
  };
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        const client = getShopifyClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw = (await client.product.fetchAll(250)) as unknown as any[];

        if (!cancelled) {
          const normalized = raw && raw.length > 0
            ? raw.map(normalizeProduct)
            : MOCK_PRODUCTS;
          setProducts(normalized);
        }
      } catch {
        if (!cancelled) {
          setProducts(MOCK_PRODUCTS);
          setError(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProducts();
    return () => { cancelled = true; };
  }, []);

  return { products, loading, error };
}

export default useProducts;
