import axios, { AxiosError } from "axios";
import { createAppError, ErrorCodes } from "@/lib/errorHandler";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// ── Request interceptor — attach access token from localStorage ───────────────

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(createAppError(error, "Request configuration failed")),
);

// ── Response interceptor — handle 401 and wrap errors ───────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };

    const isLoginEndpoint = originalRequest?.url?.includes("/auth/login");
    const isRegisterEndpoint = originalRequest?.url?.includes("/auth/register");

    // Handle 401 — clear tokens and optionally redirect
    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !isLoginEndpoint &&
      !isRegisterEndpoint
    ) {
      if (originalRequest) originalRequest._retry = true;

      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // Uncomment below to auto-redirect on session expiry:
        // window.location.href = "/login";
      }

      // Throw a typed auth error so components can react specifically
      return Promise.reject(
        createAppError(error, "Your session has expired. Please log in again.", {
          action: "responseInterceptor",
        })
      );
    }

    // For all other errors, wrap but re-throw so callers can handle them
    // We do NOT call createAppError here to avoid double-wrapping;
    // callers in the API layer (donorApi, requestApi, slices) do it themselves.
    return Promise.reject(error);
  },
);

export default apiClient;

// ── Re-export error utilities so slices can import from one place ─────────────
export { createAppError, ErrorCodes };
