import Link from "next/link";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como a FBG Jeans coleta, usa e protege seus dados pessoais.",
};

export default function PrivacidadePage() {
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

        <h1 style={{ fontWeight: 900, fontStyle: "italic", fontSize: "clamp(2rem,5vw,3.6rem)", letterSpacing: "-0.03em", textTransform: "uppercase", color: "#141414", lineHeight: 1.05, marginBottom: "12px", margin: "0 0 12px" }}>
          Política de Privacidade
        </h1>

        <p style={{ fontSize: "0.75rem", color: "rgba(0,0,0,0.35)", marginBottom: "48px" }}>
          Última atualização: julho de 2026
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "40px", color: "rgba(0,0,0,0.7)", fontSize: "0.9rem", lineHeight: 1.8 }}>
          {[
            {
              title: "1. Quem somos",
              body: "FREEBONG · FBG Jeans Wear, pessoa jurídica de direito privado, é responsável pelo tratamento dos dados pessoais coletados neste site. Para qualquer questão sobre privacidade, entre em contato pelo WhatsApp.",
            },
            {
              title: "2. Dados que coletamos",
              body: "Coletamos apenas os dados que você fornece voluntariamente: e-mail (via formulário de newsletter ou cadastro), nome e telefone (via formulário de revendedores). Também podemos coletar dados de navegação via cookies para fins estatísticos.",
            },
            {
              title: "3. Como usamos seus dados",
              body: "Seus dados são usados para: envio de comunicações sobre lançamentos e promoções (somente com seu consentimento); contato via WhatsApp para parcerias de revenda; melhoria da experiência no site.",
            },
            {
              title: "4. Compartilhamento",
              body: "Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins comerciais. Podemos compartilhar dados com prestadores de serviços estritamente necessários à operação do site.",
            },
            {
              title: "5. Seus direitos",
              body: "De acordo com a LGPD (Lei 13.709/2018), você tem direito a: acessar seus dados, corrigir informações incorretas, solicitar exclusão dos seus dados e revogar seu consentimento a qualquer momento. Para exercer esses direitos, entre em contato pelo WhatsApp.",
            },
            {
              title: "6. Cookies",
              body: "Utilizamos cookies essenciais para o funcionamento do site e cookies analíticos para entender como os visitantes interagem com nosso conteúdo. Você pode recusar cookies não essenciais através do banner de consentimento.",
            },
            {
              title: "7. Contato",
              body: "Para qualquer dúvida sobre esta política ou sobre seus dados, entre em contato pelo WhatsApp.",
            },
          ].map(section => (
            <section key={section.title}>
              <h2 style={{ fontWeight: 900, fontSize: "1rem", letterSpacing: "-0.01em", color: "#141414", marginBottom: "12px", margin: "0 0 12px" }}>
                {section.title}
              </h2>
              <p style={{ margin: 0 }}>{section.body}</p>
            </section>
          ))}
        </div>

        <div style={{ marginTop: "60px", padding: "28px 32px", background: "#F8F5F0", borderLeft: "3px solid #B59672" }}>
          <p style={{ fontSize: "0.82rem", color: "rgba(0,0,0,0.6)", lineHeight: 1.7, margin: 0 }}>
            Esta política está em constante atualização. Em caso de dúvidas,{" "}
            <a href="https://wa.me/message/3ROGXK7TIP7TC1" target="_blank" rel="noopener noreferrer" style={{ color: "#B59672", textDecoration: "underline" }}>
              fale conosco pelo WhatsApp
            </a>
            .
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
