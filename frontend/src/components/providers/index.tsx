'use client';

import { Toaster } from "@/components/ui/sonner";
// import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ReactNode, useState } from "react";

export function Providers({ children }: { children: ReactNode }) {
  // Criar QueryClient dentro do component para evitar problemas de SSR
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }));

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {children}
          <Toaster />
          {/* <Sonner /> */}
        </TooltipProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}