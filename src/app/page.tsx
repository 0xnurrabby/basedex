"use client";

import React from "react";
import { Header } from "../components/Header";
import { SwapCard } from "../components/SwapCard";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <div className="h-full h-[100dvh] max-h-[100dvh] flex flex-col justify-between overflow-hidden bg-canvas text-ink transition-colors duration-200">
      <Header />

      <main className="flex-1 overflow-y-auto sm:overflow-visible flex items-center justify-center px-3 sm:px-4 py-1 sm:py-4 w-full max-w-lg mx-auto min-h-0">
        <SwapCard />
      </main>

      <Footer />
    </div>
  );
}
