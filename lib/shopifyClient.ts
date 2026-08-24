import Client from "shopify-buy";

// Tipo do cliente Shopify retornado pela biblioteca shopify-buy
type ShopifyClient = ReturnType<typeof Client.buildClient>;

// Instância singleton do cliente — null até ser inicializada pela primeira vez
let shopifyClient: ShopifyClient | null = null;

/**
 * Inicializa o cliente Shopify usando as variáveis de ambiente do projeto.
 * Deve ser chamada uma vez antes de qualquer uso do cliente.
 * Chamadas subsequentes retornam o mesmo cliente sem reinicializar.
 */
export function initializeShopifyClient(): ShopifyClient {
  if (shopifyClient) return shopifyClient;

  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL;
  const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

  if (!domain || !storefrontAccessToken) {
    throw new Error(
      "Variáveis de ambiente NEXT_PUBLIC_SHOPIFY_STORE_URL e NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN são obrigatórias."
    );
  }

  shopifyClient = Client.buildClient({
    domain,
    storefrontAccessToken,
    // A versão da API Storefront do Shopify a ser utilizada
    apiVersion: "2025-01",
  });

  return shopifyClient;
}

/**
 * Retorna o cliente Shopify já inicializado.
 * Inicializa automaticamente na primeira chamada caso ainda não tenha sido feito.
 */
export function getShopifyClient(): ShopifyClient {
  return shopifyClient ?? initializeShopifyClient();
}

export default getShopifyClient;
