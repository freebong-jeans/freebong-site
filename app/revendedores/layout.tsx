import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revendedores",
  description:
    "Seja um revendedor FBG Jeans. Margem competitiva, suporte de marketing e produto premium. Presente em 27 estados. Parceria FBG.",
  alternates: { canonical: "https://fbg-jeans.vercel.app/revendedores" },
  openGraph: {
    title: "Revendedores · FBG Jeans",
    description: "Você vende a identidade. A gente cuida do resto. Seja um parceiro FBG.",
    url: "https://fbg-jeans.vercel.app/revendedores",
    images: [{ url: "/images/freebong-instagram.jpg", width: 1200, height: 630, alt: "Revendedores FBG Jeans" }],
  },
};

export default function RevendedoresLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
