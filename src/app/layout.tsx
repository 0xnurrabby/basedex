import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "../providers/Web3Provider";

export const metadata: Metadata = {
  title: "Base Dex | Minimalist On-Chain Terminal for Base Chain",
  description:
    "Minimalist on-chain DEX terminal for Base Chain directly routed via Aerodrome Finance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-canvas text-ink min-h-screen flex flex-col antialiased selection:bg-hairline selection:text-white">
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
