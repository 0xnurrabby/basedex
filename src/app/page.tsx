"use client";

import React from "react";
import { Header } from "../components/Header";
import { SwapCard } from "../components/SwapCard";
import { HistoryCard } from "../components/HistoryCard";
import { Footer } from "../components/Footer";
import { useView } from "../providers/ViewProvider";

export default function Home() {
  const { view, setView } = useView();

  return (
    <div className="h-full h-[100dvh] max-h-[100dvh] flex flex-col justify-between overflow-hidden bg-canvas text-ink transition-colors duration-200">
      <Header />

      <main className="flex-1 overflow-y-auto sm:overflow-visible flex items-center justify-center px-3 sm:px-4 py-1 sm:py-4 w-full max-w-lg mx-auto min-h-0">
        {view === "swap" ? (
          <SwapCard />
        ) : (
          <HistoryCard onBack={() => setView("swap")} />
        )}
      </main>

      <Footer />
    </div>
  );
}
