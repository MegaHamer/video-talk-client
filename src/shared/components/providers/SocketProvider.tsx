"use client";

import { useEffect } from "react";
import { useSocketStore } from "../store/socketStore";

export function SocketProvider() {
  const { connect, disconnect } = useSocketStore();

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);
  return null;
}
