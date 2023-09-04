"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type Props = {
  children?: React.ReactNode;
};
const queryClient = new QueryClient();
export const NextAuthProvider = ({ children }: Props) => {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
};
