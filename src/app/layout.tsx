import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { SiteFooter } from "./components/SiteFooter";

export const metadata: Metadata = {
  title: "TaskForge | On-chain work, rewarded",
  description: "A decentralized task marketplace for BOT Chain.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body><Providers>{children}<SiteFooter /></Providers></body>
    </html>
  );
}
