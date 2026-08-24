import type { Metadata } from "next";
import LookBuilder from "@/components/LookBuilder";
import VistaEm3D from "@/components/VistaEm3D";

export const metadata: Metadata = {
  title: "Monte Seu Look · FBG Jeans",
  description:
    "Experimente o kit FBG em 3D. Escolha sua calça e visualize o look no boneco interativo.",
};

export default function MontarLookPage() {
  return (
    <>
      <LookBuilder />
      <VistaEm3D />
    </>
  );
}
