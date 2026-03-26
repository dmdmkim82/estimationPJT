import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "연료전지 EPC 견적 스튜디오 | Fuel Cell EPC Estimate Studio",
  description:
    "연료전지 EPC 견적을 위한 레퍼런스 기반 워크스페이스. Reference-driven fuel-cell EPC estimation workspace with workbook import, escalation logic, risk review, and LCOE comparison.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
