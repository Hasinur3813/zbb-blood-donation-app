import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { createAppError, logError } from "@/lib/errorHandler";

/**
 * Global error callback for both queries and mutations.
 * We log the error here; the UI-level toast is fired via the individual
 * query/mutation `onError` callbacks or the `useGlobalQueryErrors` hook,
 * because we cannot call React hooks from inside QueryCache/MutationCache.
 */
function handleGlobalError(error: unknown, context?: string): void {
  const appError = createAppError(error);
  logError(appError, { component: "QueryClient", action: context });
}

function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError(error, query) {
        // Only trigger global handler if the query has no dedicated onError
        const hasLocalHandler =
          typeof query.options.meta?.onError === "function";
        if (!hasLocalHandler) {
          handleGlobalError(error, `query:${String(query.queryKey[0])}`);
        }
      },
    }),
    mutationCache: new MutationCache({
      onError(error, _variables, _context, mutation) {
        const hasLocalHandler =
          typeof mutation.options.onError === "function" ||
          typeof mutation.options.meta?.onError === "function";
        if (!hasLocalHandler) {
          handleGlobalError(error, "mutation");
        }
      },
    }),
    defaultOptions: {
      queries: {
        // With SSR, keep staleTime above 0 to avoid immediate re-fetch
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error) => {
          // Don't retry on client errors (auth / not found / bad request)
          const status = (error as { response?: { status?: number } })
            .response?.status;
          if (status === 401 || status === 403 || status === 404 || status === 422) {
            return false;
          }
          return failureCount < 2;
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0, // Never retry mutations by default
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always create a new query client
    return makeQueryClient();
  }
  // Browser: reuse the same client across renders
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
