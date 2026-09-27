import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "../providers/Web3Provider";
import { ThemeProvider } from "../providers/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://basedex.lol"),
  title: "Base Dex | Minimalist On-Chain Terminal for Base Chain",
  description:
    "Ultra-fast, zero-friction token swaps on Base directly routed via Aerodrome Finance.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Base Dex | Minimalist On-Chain Terminal for Base Chain",
    description:
      "Ultra-fast, zero-friction token swaps on Base directly routed via Aerodrome Finance.",
    url: "https://basedex.lol",
    siteName: "Base Dex",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Base Dex - Minimalist On-Chain Swap Terminal",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Base Dex | Minimalist On-Chain Terminal for Base Chain",
    description:
      "Ultra-fast, zero-friction token swaps on Base directly routed via Aerodrome Finance.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('basedex-theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="bg-canvas text-ink h-full h-[100dvh] flex flex-col antialiased selection:bg-hairline selection:text-ink transition-colors duration-200 overflow-hidden sm:overflow-auto">
        <ThemeProvider>
          <Web3Provider>{children}</Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
