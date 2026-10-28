/**
 * Regras comerciais que aparecem em varios pontos do site. Mudou a regra,
 * muda aqui. Os mesmos valores precisam estar configurados na Shopify:
 * o cupom em Descontos e o frete gratis em Configuracoes > Frete.
 */

export const CUPOM_BOAS_VINDAS = "BEMVINDO12";
export const DESCONTO_BOAS_VINDAS = 12; // %
export const FRETE_GRATIS_MINIMO = 550; // R$
export const PARCELAS_SEM_JUROS = 3;

export const freteGratisTexto = `R$ ${FRETE_GRATIS_MINIMO}`;
