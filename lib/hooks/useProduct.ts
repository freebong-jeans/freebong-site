"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchProductByHandle } from "@/lib/shopifyProducts";
import type { ShopifyProduct } from "@/lib/shopifyProducts";

interface UseProductResult {
  product: ShopifyProduct | null;
  loading: boolean;
  error: Error | null;
  retry: () => void;
}

/**
 * Uma peca especifica, sempre vinda da Shopify. Sem substituto local:
 * mostrar uma peca inventada no lugar da real seria pior do que avisar
 * que nao deu para carregar.
 */
export function useProduct(handle: string): UseProductResult {
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [tentativa, setTentativa] = useState(0);

  const retry = useCallback(() => setTentativa((n) => n + 1), []);

  useEffect(() => {
    if (!handle) return;

    const controller = new AbortController();
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchProductByHandle(handle, controller.signal)
      .then((p) => {
        if (cancelled) return;
        setProduct(p);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled || controller.signal.aborted) return;
        setProduct(null);
        setError(err instanceof Error ? err : new Error("Falha ao carregar a peca"));
        setLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [handle, tentativa]);

  return { product, loading, error, retry };
}

export default useProduct;
