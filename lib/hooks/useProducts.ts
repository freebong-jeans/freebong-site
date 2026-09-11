"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchAllProducts } from "@/lib/shopifyProducts";

export type {
  ShopifyImage,
  ShopifyProductVariant,
  ShopifyProduct,
} from "@/lib/shopifyProducts";

import type { ShopifyProduct } from "@/lib/shopifyProducts";

interface UseProductsResult {
  products: ShopifyProduct[];
  loading: boolean;
  error: Error | null;
  retry: () => void;
}

/**
 * Catalogo da loja, sempre vindo da Shopify.
 *
 * Nao existe catalogo de reserva: se a Shopify nao responder, a pagina
 * mostra um aviso com opcao de tentar de novo. Antes o site trocava o
 * catalogo real por uma lista fixa embutida no codigo, o que fazia
 * aparecerem pecas que nao existiam na loja sempre que a conexao falhava.
 */
export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [tentativa, setTentativa] = useState(0);

  const retry = useCallback(() => setTentativa((n) => n + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchAllProducts(controller.signal)
      .then((lista) => {
        if (cancelled) return;
        setProducts(lista);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled || controller.signal.aborted) return;
        setProducts([]);
        setError(err instanceof Error ? err : new Error("Falha ao carregar o catalogo"));
        setLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [tentativa]);

  return { products, loading, error, retry };
}

export default useProducts;
