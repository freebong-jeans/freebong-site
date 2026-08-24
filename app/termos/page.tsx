import Link from "next/link";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos e condições de uso do site FBG Jeans.",
};

export default function TermosPage() {
  return (
    <div style={{ background: "#FAF9F7", minHeight: "100vh", fontFamily: "'Helvetica Neue', Helvetica, sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "clamp(100px,14vw,160px) clamp(24px,5vw,48px) clamp(64px,8vw,96px)" }}>

        <nav style={{ marginBottom: "40px" }}>
          <Link href="/" style={{ fontSize: "0.65rem", letterSpacing: "0.12em", color: "rgba(0,0,0,0.4)", textDecoration: "none", textTransform: "uppercase" }}>
            ← Início
          </Link>
        </nav>

        <span style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#B59672", display: "block", marginBottom: "16px" }}>
          Documento Legal
        </span>

        <h1 style={{ fontWeight: 900, fontStyle: "italic", fontSize: "clamp(2rem,5vw,3.6rem)", letterSpacing: "-0.03em", textTransform: "uppercase", color: "#141414", lineHeight: 1.05, margin: "0 0 12px" }}>
          Termos de Uso
        </h1>

        <p style={{ fontSize: "0.75rem", color: "rgba(0,0,0,0.35)", marginBottom: "48px" }}>
          Última atualização: julho de 2026
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "40px", color: "rgba(0,0,0,0.7)", fontSize: "0.9rem", lineHeight: 1.8 }}>
          {[
            {
              title: "1. Aceitação dos Termos",
              body: "Ao acessar e utilizar este site, você concorda com os presentes Termos de Uso. Caso não concorde, por favor, não utilize nossos serviços.",
            },
            {
              title: "2. Uso do Site",
              body: "Este site é destinado exclusivamente para fins comerciais legítimos relacionados à compra e venda de produtos FBG Jeans. É proibido o uso do site para fins ilegais, fraudulentos ou prejudiciais à marca.",
            },
            {
              title: "3. Produtos e Preços",
              body: "Os produtos e preços exibidos estão sujeitos a disponibilidade de estoque. A FBG reserva o direito de alterar preços sem aviso prévio. A compra é efetivada após confirmação de pagamento.",
            },
            {
              title: "4. Entrega",
              body: "Os prazos de entrega são estimativas e podem variar de acordo com a localidade. A FBG não se responsabiliza por atrasos causados por transportadoras ou pelos Correios.",
            },
            {
              title: "5. Trocas e Devoluções",
              body: "Aceitamos trocas e devoluções em até 30 dias após o recebimento do produto, desde que o item esteja sem uso, com etiqueta original e em perfeitas condições. Entre em contato pelo WhatsApp para iniciar o processo.",
            },
            {
              title: "6. Propriedade Intelectual",
              body: "Todas as marcas, logotipos, imagens e conteúdos deste site são de propriedade exclusiva da FREEBONG. É proibida a reprodução, distribuição ou uso não autorizado desses elementos.",
            },
            {
              title: "7. Limitação de Responsabilidade",
              body: "A FBG não se responsabiliza por danos indiretos, incidentais ou consequenciais decorrentes do uso ou impossibilidade de uso deste site.",
            },
            {
              title: "8. Modificações",
              body: "Estes termos podem ser atualizados a qualquer momento. Recomendamos a revisão periódica desta página.",
            },
          ].map(section => (
            <section key={section.title}>
              <h2 style={{ fontWeight: 900, fontSize: "1rem", letterSpacing: "-0.01em", color: "#141414", margin: "0 0 12px" }}>
                {section.title}
              </h2>
              <p style={{ margin: 0 }}>{section.body}</p>
            </section>
          ))}
        </div>

        <div style={{ marginTop: "60px", padding: "28px 32px", background: "#F8F5F0", borderLeft: "3px solid #B59672" }}>
          <p style={{ fontSize: "0.82rem", color: "rgba(0,0,0,0.6)", lineHeight: 1.7, margin: 0 }}>
            Dúvidas sobre nossos termos?{" "}
            <a href="https://wa.me/message/3ROGXK7TIP7TC1" target="_blank" rel="noopener noreferrer" style={{ color: "#B59672", textDecoration: "underline" }}>
              Fale conosco pelo WhatsApp
            </a>
            .
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
