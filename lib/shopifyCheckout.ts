/**
 * Checkout da Shopify (com pagamento).
 *
 * Usa a Cart API atual. O SDK shopify-buy montava o checkout pela API
 * antiga (checkoutCreate), que a Shopify descontinuou; a Cart API e o
 * caminho suportado hoje.
 *
 * O endereco devolvido em checkoutUrl fica sempre no DOMINIO PRINCIPAL
 * configurado na Shopify (Configuracoes > Dominios). Se esse dominio
 * estiver apontando para a hospedagem do site em vez de apontar para a
 * Shopify, o cliente cai num redirecionamento que nao chega ao pagamento.
 * O dominio principal da Shopify precisa ser um subdominio que aponta para
 * ela (loja.freebong.com.br, CNAME shops.myshopify.com). Os redirects de
 * /cart e /checkouts em next.config.ts cobrem links que ainda saiam no
 * dominio do site.
 */

const API_VERSION = "2025-01";

export interface LinhaCheckout {
  variantId: string;
  quantity: number;
}

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

const MUTACAO = `
  mutation CriarCarrinho($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { checkoutUrl }
      userErrors { field message }
    }
  }
`;

/**
 * Cria o carrinho na Shopify e devolve o endereco do checkout, onde o
 * cliente paga. Lanca erro se a Shopify recusar alguma linha (por exemplo
 * uma variante que saiu de estoque enquanto o carrinho estava aberto).
 */
export async function criarCheckoutUrl(linhas: LinhaCheckout[]): Promise<string> {
  if (linhas.length === 0) throw new Error("Carrinho vazio.");

  const res = await fetch(endpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token(),
    },
    body: JSON.stringify({
      query: MUTACAO,
      variables: {
        lines: linhas.map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity })),
      },
    }),
  });

  if (!res.ok) throw new Error(`Shopify respondeu HTTP ${res.status}`);

  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0]?.message ?? "Erro na Storefront API");

  const erro = json.data?.cartCreate?.userErrors?.[0];
  if (erro) throw new Error(erro.message ?? "A Shopify recusou o carrinho.");

  const url = json.data?.cartCreate?.cart?.checkoutUrl;
  if (!url) throw new Error("A Shopify nao devolveu o endereco de checkout.");

  return url as string;
}
