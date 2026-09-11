/**
 * Canal de vendas da Freebong no WhatsApp.
 *
 * O numero fica aqui, num lugar so: se a loja trocar de telefone, basta
 * mudar esta linha.
 *
 * Importante: o link curto "wa.me/message/CODIGO" NAO aceita mensagem
 * pronta. Para o pedido chegar ja escrito e preciso usar o numero em
 * formato internacional, como abaixo.
 */
export const WHATSAPP_NUMERO = "553175135344";

export function linkWhatsApp(mensagem?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMERO}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}

export interface ItemPedido {
  title: string;
  variantTitle: string;
  quantity: number;
  price: string;
}

/** Monta o texto do pedido que a Freebong recebe no WhatsApp. */
export function mensagemPedido(items: ItemPedido[], total: number): string {
  const dinheiro = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const linhas = items.map((i) => {
    const unit = parseFloat(i.price) || 0;
    const tamanho = i.variantTitle ? `Tam ${i.variantTitle}` : "Tamanho único";
    return `▸ ${i.title}\n   ${tamanho} · ${i.quantity}x · ${dinheiro(unit * i.quantity)}`;
  });

  return (
    "Olá! Quero finalizar meu pedido na FBG:\n\n" +
    linhas.join("\n") +
    `\n\nTotal: ${dinheiro(total)}`
  );
}
