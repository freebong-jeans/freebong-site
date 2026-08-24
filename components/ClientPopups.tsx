"use client";

import dynamic from "next/dynamic";

const CookieBanner = dynamic(() => import("@/components/CookieBanner"), { ssr: false });
const WelcomePopup = dynamic(() => import("@/components/WelcomePopup"), { ssr: false });

export default function ClientPopups() {
  return (
    <>
      <CookieBanner />
      <WelcomePopup />
    </>
  );
}
