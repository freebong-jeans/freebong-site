/**
 * Acesso direto a Storefront API da Shopify.
 *
 * Substitui o uso do SDK shopify-buy para LEITURA de produtos: o SDK nao
 * traz o campo `tags`, o que deixava os filtros da loja sem dados. Aqui a
 * query pede exatamente os campos que o site usa, entao tudo que a equipe
 * cadastra na Shopify (tipo de produto, tags, fotos, preco, estoque)
 * chega no site sem precisar mexer em codigo.
 */

export interface ShopifyImage {
  id: string;
  src: string;
  altText: string | null;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  sku: string;
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

const API_VERSION = "2025-01";

const PRODUCT_FIELDS = `
  id
  title
  handle
  description
  descriptionHtml
  productType
  tags
  images(first: 12) { edges { node { id url altText } } }
  variants(first: 100) {
    edges {
      node {
        id
        title
        sku
        availableForSale
        price { amount }
        image { id url altText }
      }
    }
  }
`;

function endpoint(): string {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL;
  if (!domain) throw new Error("NEXT_PUBLIC_SHOPIFY_STORE_URL nao configurada.");
  return `https://${domain}/api/${API_VERSION}/graphql.json`;
}

function token(): string {
  const t = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
  if (!t) throw new Error("NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN nao configurada.");
  return t;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapImage(node: any): ShopifyImage {
  return {
    id: String(node?.id ?? ""),
    src: node?.url ?? "",
    altText: node?.altText ?? null,
  };
}

function mapProduct(node: any): ShopifyProduct {
  return {
    id: String(node?.id ?? ""),
    title: node?.title ?? "",
    handle: node?.handle ?? "",
    description: node?.description ?? "",
    descriptionHtml: node?.descriptionHtml ?? "",
    productType: node?.productType ?? "",
    tags: Array.isArray(node?.tags) ? node.tags.map((t: any) => String(t)) : [],
    images: (node?.images?.edges ?? []).map((e: any) => mapImage(e?.node)),
    variants: (node?.variants?.edges ?? []).map((e: any) => {
      const v = e?.node ?? {};
      return {
        id: String(v.id ?? ""),
        title: v.title ?? "",
        sku: v.sku ?? "",
        price: String(v.price?.amount ?? "0"),
        available: Boolean(v.availableForSale),
        image: v.image ? mapImage(v.image) : null,
      };
    }),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Faz a chamada com uma segunda tentativa. Conexao movel instavel era o que
 * derrubava o carregamento do catalogo; agora ele tenta de novo em vez de
 * desistir.
 */
async function query<T>(body: string, signal?: AbortSignal): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(endpoint(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": token(),
        },
        body,
        signal,
      });

      if (!res.ok) throw new Error(`Shopify respondeu HTTP ${res.status}`);

      const json = await res.json();
      if (json.errors?.length) {
        throw new Error(json.errors[0]?.message ?? "Erro na Storefront API");
      }
      return json.data as T;
    } catch (err) {
      if (signal?.aborted) throw err;
      lastError = err;
      if (attempt === 0) await new Promise((r) => setTimeout(r, 800));
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Falha ao falar com a Shopify");
}

export async function fetchAllProducts(signal?: AbortSignal): Promise<ShopifyProduct[]> {
  const body = JSON.stringify({
    query: `{ products(first: 250) { edges { node { ${PRODUCT_FIELDS} } } } }`,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await query<any>(body, signal);
  return (data?.products?.edges ?? []).map((e: { node: unknown }) => mapProduct(e.node));
}

export async function fetchProductByHandle(
  handle: string,
  signal?: AbortSignal
): Promise<ShopifyProduct | null> {
  const body = JSON.stringify({
    query: `query ProdutoPorHandle($handle: String!) { product(handle: $handle) { ${PRODUCT_FIELDS} } }`,
    variables: { handle },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await query<any>(body, signal);
  return data?.product ? mapProduct(data.product) : null;
}
