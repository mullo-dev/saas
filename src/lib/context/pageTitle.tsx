"use client"

import { createContext, useContext, useState } from "react";

const PageTitleContext = createContext<any>(null);

export const usePageTitle = () => useContext(PageTitleContext);

type headerType = {
  title: string,
  menuContent: React.ReactNode
}

export function PageTitleProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState<headerType>();

  return (
    <PageTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
}