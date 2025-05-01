'use client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {type PropsWithChildren, useState } from "react";

export default function QueryProvider({ children }: PropsWithChildren<unknown>) {
  const [client] = useState(new QueryClient());
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
