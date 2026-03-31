import axios from "axios";

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
  (error) => Promise.reject(error),
);

// ── Response interceptor — handle 401 error ──────────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isLoginEndpoint = error.config?.url?.includes("/auth/login");
    const isRegisterEndpoint = error.config?.url?.includes("/auth/register");

    // Optional: implement token refresh logic here.
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isLoginEndpoint &&
      !isRegisterEndpoint
    ) {
      originalRequest._retry = true;
      // Handle logout or refresh

      if (typeof window !== "undefined") {
        // Clear tokens if no refresh token mechanism is implemented
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
