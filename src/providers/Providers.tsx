"use client";

import { Provider as ReduxProvider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { store } from "@/store";
import { getQueryClient } from "@/lib/queryClient";
import { ErrorToastProvider } from "@/components/ErrorToast/ErrorToastProvider";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import { AuthInitializer } from "./AuthInitializer";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const queryClient = getQueryClient();

  return (
    // ReduxProvider must be outermost so ErrorBoundary can (optionally) dispatch
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        {/*
         * ErrorToastProvider MUST wrap ErrorBoundary so that the boundary's
         * fallback UI can call useErrorToast() without throwing.
         */}
        <ErrorToastProvider>
          <AuthInitializer>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </AuthInitializer>
          <ReactQueryDevtools initialIsOpen={false} />
        </ErrorToastProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
