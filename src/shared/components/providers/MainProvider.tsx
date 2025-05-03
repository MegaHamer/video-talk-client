"use client";
import { PropsWithChildren } from "react";
import { ThemeProvider } from "./ThemeProvider";
import QueryProvider from "./QueryProvider";
import { ToastProvider } from "./ToastProvider";

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
        <ToastProvider />
      </ThemeProvider>
    </QueryProvider>
  );
}
