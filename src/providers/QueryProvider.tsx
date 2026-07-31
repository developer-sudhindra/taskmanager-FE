import type { ReactNode } from "react";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

interface IQueryProvider {
  children: ReactNode;
}

export default function QueryProvider({ children }: IQueryProvider) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
