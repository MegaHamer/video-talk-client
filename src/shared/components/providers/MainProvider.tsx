'use client'
import { PropsWithChildren } from "react";
import { ThemeProvider } from "./ThemeProvider";

export function MainProvider({ children }: PropsWithChildren<unknown>) {
    return (
        <ThemeProvider
            attribute='class'
            defaultTheme='system'
            disableTransitionOnChange
            enableSystem
        >
            {children}
        </ThemeProvider>
    )
}