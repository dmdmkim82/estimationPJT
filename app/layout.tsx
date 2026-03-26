import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const copy = {
  title: "SOFC EPC \uACAC\uC801 \uC2A4\uD29C\uB514\uC624 | Fuel Cell EPC Estimate Studio",
  description:
    "\uC6CC\uD06C\uBD81 \uAE30\uC900 SOFC EPC \uACAC\uC801, \uBB3C\uAC00\uC0C1\uC2B9, \uD604\uC7A5\uC870\uAC74, \uB9AC\uC2A4\uD06C, LCOE\uB97C \uD55C \uD654\uBA74\uC5D0\uC11C \uAC80\uD1A0\uD558\uB294 \uC2A4\uD29C\uB514\uC624.",
};

export const metadata: Metadata = {
  title: copy.title,
  description: copy.description,
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
