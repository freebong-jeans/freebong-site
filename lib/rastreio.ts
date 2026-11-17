/**
 * Google Tag Manager + Pixel da Meta.
 *
 * Os dois so carregam depois que o visitante aceita os cookies (LGPD):
 * o banner grava "accepted" e dispara o evento CONSENTIMENTO_EVENTO.
 *
 * A compra (Purchase) acontece no checkout da Shopify, fora deste site:
 * ela e enviada pelo app "Facebook e Instagram" da Shopify, conectado ao
 * mesmo pixel, que tambem cuida da API de Conversoes. O token da API de
 * Conversoes e segredo: fica so na Meta/Shopify, nunca neste codigo.
 */

export const GTM_ID = "GTM-529DNGS3";
export const META_PIXEL_ID = "1472841774788723";
export const CONSENTIMENTO_CHAVE = "fbg_cookie_consent";
export const CONSENTIMENTO_EVENTO = "fbg:consentimento";

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: Fbq;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

export function consentiu(): boolean {
  try {
    return localStorage.getItem(CONSENTIMENTO_CHAVE) === "accepted";
  } catch {
    return false;
  }
}

let carregado = false;

/** Injeta GTM e Pixel uma unica vez. Chamar so com consentimento. */
export function carregarRastreio(): void {
  if (carregado || typeof window === "undefined") return;
  carregado = true;

  // Google Tag Manager
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const gtm = document.createElement("script");
  gtm.async = true;
  gtm.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(gtm);

  // Pixel da Meta (mesmo stub do codigo oficial)
  if (!window.fbq) {
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    } as Fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    window.fbq = fbq;
    window._fbq = fbq;
    const px = document.createElement("script");
    px.async = true;
    px.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(px);
  }
  window.fbq("init", META_PIXEL_ID);
}

/** "gid://shopify/ProductVariant/123" -> "123" */
function idNumerico(gid: string): string {
  return gid.split("/").pop() ?? gid;
}

/**
 * Mesmo formato de id que o app da Shopify usa no catalogo da Meta, para
 * os anuncios de catalogo reconhecerem o produto.
 */
export function idCatalogo(produtoId: string, varianteId: string): string {
  return `shopify_BR_${idNumerico(produtoId)}_${idNumerico(varianteId)}`;
}

export interface ItemRastreio {
  produtoId: string;
  varianteId: string;
  nome: string;
  preco: number;
  quantidade: number;
}

type EventoMeta = "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout";
const GA4: Record<EventoMeta, string> = {
  PageView: "page_view",
  ViewContent: "view_item",
  AddToCart: "add_to_cart",
  InitiateCheckout: "begin_checkout",
};

/** Envia o evento para o Pixel e para o dataLayer do GTM (nomes do GA4). */
export function rastrear(evento: EventoMeta, itens: ItemRastreio[] = []): void {
  if (!carregado || !window.fbq) return;

  if (evento === "PageView") {
    window.fbq("track", "PageView");
    window.dataLayer?.push({ event: "page_view", page_path: location.pathname });
    return;
  }

  const valor = Number(itens.reduce((s, i) => s + i.preco * i.quantidade, 0).toFixed(2));
  window.fbq("track", evento, {
    content_ids: itens.map((i) => idCatalogo(i.produtoId, i.varianteId)),
    content_type: "product",
    contents: itens.map((i) => ({ id: idCatalogo(i.produtoId, i.varianteId), quantity: i.quantidade })),
    num_items: itens.reduce((s, i) => s + i.quantidade, 0),
    value: valor,
    currency: "BRL",
  });
  window.dataLayer?.push({ ecommerce: null });
  window.dataLayer?.push({
    event: GA4[evento],
    ecommerce: {
      currency: "BRL",
      value: valor,
      items: itens.map((i) => ({
        item_id: idNumerico(i.varianteId),
        item_name: i.nome,
        price: i.preco,
        quantity: i.quantidade,
      })),
    },
  });
}
