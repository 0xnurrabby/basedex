import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "../providers/Web3Provider";
import { ThemeProvider } from "../providers/ThemeProvider";

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('basedex-theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="bg-canvas text-ink min-h-screen flex flex-col antialiased selection:bg-hairline selection:text-ink transition-colors duration-200">
        <ThemeProvider>
          <Web3Provider>{children}</Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
