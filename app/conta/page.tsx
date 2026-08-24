import type { Metadata } from "next";
import AuthPage from "@/components/AuthPage";

export const metadata: Metadata = {
  title: "Minha Conta",
  description:
    "Entre ou crie sua conta FBG e acesse cupons exclusivos, acesso antecipado a drops e o programa de fidelidade.",
  robots: { index: false, follow: false },
};

export default function ContaPage() {
  return <AuthPage />;
}
