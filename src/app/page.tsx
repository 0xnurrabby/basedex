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
    <div className="min-h-screen min-h-[100dvh] flex flex-col justify-between bg-canvas text-ink transition-colors duration-200">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-3 sm:px-4 py-4 sm:py-6 w-full max-w-lg mx-auto my-auto">
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
