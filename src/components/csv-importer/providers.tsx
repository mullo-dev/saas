"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

import { TooltipProvider } from "@/components/ui/tooltip"

export function ThemeProvider({
  children,
  ...props
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <NextThemesProvider {...props}>
      <TooltipProvider>{children}</TooltipProvider>
    </NextThemesProvider>
  )
}
