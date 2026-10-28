/**
 * Envia um cadastro para o Netlify Forms. Os formularios estao declarados
 * em public/__forms.html (a Netlify so detecta formulario em HTML estatico)
 * e os cadastros ficam no painel da Netlify, em Forms, com exportacao CSV.
 *
 * Fora da Netlify (npm run dev) o envio falha; quem chama ignora o erro,
 * porque o cupom e mostrado de qualquer jeito.
 */
export async function enviarLead(form: string, campos: Record<string, string>): Promise<void> {
  const body = new URLSearchParams({ "form-name": form, ...campos });
  const res = await fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`Netlify Forms respondeu HTTP ${res.status}`);
}
