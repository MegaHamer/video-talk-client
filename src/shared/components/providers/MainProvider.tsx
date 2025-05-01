"use client";
import { PropsWithChildren } from "react";
import { ThemeProvider } from "./ThemeProvider";
import QueryProvider from "./QueryProvider";

export function MainProvider({ children }: PropsWithChildren<unknown>) {
  return (
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
        enableSystem
      >
        {children}
      </ThemeProvider>
    </QueryProvider>
  );
}
