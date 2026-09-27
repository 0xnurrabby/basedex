"use client";

import React, { createContext, useContext, useState } from "react";

type ActiveView = "swap" | "history";

interface ViewContextType {
  view: ActiveView;
  setView: (view: ActiveView) => void;
  toggleView: () => void;
}

const ViewContext = createContext<ViewContextType>({
  view: "swap",
  setView: () => {},
  toggleView: () => {},
});

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<ActiveView>("swap");

  const toggleView = () => {
    setView((prev) => (prev === "swap" ? "history" : "swap"));
  };

  return (
    <ViewContext.Provider value={{ view, setView, toggleView }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  return useContext(ViewContext);
}
