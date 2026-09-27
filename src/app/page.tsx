"use client";

import React from "react";
import { Header } from "../components/Header";
import { SwapCard } from "../components/SwapCard";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <div className="h-screen h-[100dvh] flex flex-col justify-between overflow-y-auto sm:overflow-hidden bg-canvas text-ink transition-colors duration-200">
      <Header />

      <main className="flex-1 flex items-center justify-center px-3 sm:px-4 py-2 sm:py-6 w-full max-w-lg mx-auto">
        <SwapCard />
      </main>

      <Footer />
    </div>
  );
}
