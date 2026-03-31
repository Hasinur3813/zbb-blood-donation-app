import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import apiClient from "@/lib/apiClient";
import type {
  AuthState,
  AuthUser,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenResponse,
} from "@/types/auth";

// ── Helpers ───────────────────────────────────────────────────────────────────

const isBrowser = typeof window !== "undefined";

function loadTokens(): {
  accessToken: string | null;
  refreshToken: string | null;
} {
  if (!isBrowser) return { accessToken: null, refreshToken: null };
  return {
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
  };
}

function persistTokens(accessToken: string, refreshToken: string) {
  if (!isBrowser) return;
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

function clearTokens() {
  if (!isBrowser) return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

// Helper to extract error message from Axios errors
function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

// ── Initial state ─────────────────────────────────────────────────────────────

const tokens = loadTokens();

const initialState: AuthState & {
  passwordResetEmailSent: boolean;
  passwordResetSuccessful: boolean;
  resetMessage: string | null;
} = {
  user: null,
  accessToken: tokens.accessToken,
  refreshToken: tokens.refreshToken,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  passwordResetEmailSent: false,
  passwordResetSuccessful: false,
  resetMessage: null,
};

// ── Async thunks ──────────────────────────────────────────────────────────────

export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginRequest,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: AuthResponse;
    }>("/auth/login", credentials);

    if (!response.data.success) {
      return rejectWithValue(response.data.message || "Login failed.");
    }

    return response.data.data;
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, "Login failed. Please check your credentials."),
    );
  }
});

export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterRequest,
  { rejectValue: string }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: AuthResponse;
    }>("/auth/register", userData);

    if (!response.data.success) {
      return rejectWithValue(response.data.message || "Registration failed.");
    }

    return response.data.data;
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, "Registration failed. Please try again."),
    );
  }
});

export const refreshAccessToken = createAsyncThunk<
  RefreshTokenResponse,
  void,
  { rejectValue: string }
>("auth/refreshToken", async (_, { getState, rejectWithValue }) => {
  const state = getState() as { auth: AuthState };
  const refreshToken = state.auth.refreshToken;
  if (!refreshToken) return rejectWithValue("No refresh token available.");

  try {
    const { data } = await apiClient.post<RefreshTokenResponse>(
      "/auth/refresh",
      { refreshToken },
    );
    return data;
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, "Session expired. Please log in again."),
    );
  }
});

export const fetchCurrentUser = createAsyncThunk<
  AuthUser,
  void,
  { rejectValue: string }
>("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: AuthUser;
    }>("/auth/me");

    if (!response.data.success) {
      return rejectWithValue(
        response.data.message || "Failed to fetch user info.",
      );
    }

    return response.data.data;
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, "Failed to fetch user info."),
    );
  }
});

export const requestPasswordReset = createAsyncThunk<
  { message: string; resetToken?: string },
  { email: string },
  { rejectValue: string }
>("auth/requestPasswordReset", async ({ email }, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: {
        resetToken?: string;
      } | null;
    }>("/auth/forgot-password", { email });

    if (!response.data.success) {
      return rejectWithValue(
        response.data.message || "Password reset request failed.",
      );
    }

    return {
      message: response.data.message,
      resetToken: response.data.data?.resetToken,
    };
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, "Password reset request failed."),
    );
  }
});

export const resetPassword = createAsyncThunk<
  { message: string },
  { token: string; password: string },
  { rejectValue: string }
>("auth/resetPassword", async ({ token, password }, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data?: null;
    }>("/auth/reset-password", {
      token,
      password,
    });

    if (!response.data.success) {
      return rejectWithValue(response.data.message || "Password reset failed.");
    }

    return { message: response.data.message };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Password reset failed."));
  }
});

// ── Slice ─────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      clearTokens();
    },
    clearAuthError(state) {
      state.error = null;
    },
    clearPasswordResetState(state) {
      state.passwordResetEmailSent = false;
      state.passwordResetSuccessful = false;
      state.resetMessage = null;
      state.error = null;
    },
    setCredentials(state, action: PayloadAction<AuthResponse>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.error = null;
      persistTokens(action.payload.accessToken, action.payload.refreshToken);
    },
  },
  extraReducers: (builder) => {
    // ── Login ──
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        persistTokens(action.payload.accessToken, action.payload.refreshToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Login failed.";
      });

    // ── Register ──
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        persistTokens(action.payload.accessToken, action.payload.refreshToken);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Registration failed.";
      });

    // ── Refresh token ──
    builder
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        persistTokens(action.payload.accessToken, action.payload.refreshToken);
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        clearTokens();
      });

    // ── Fetch current user ──
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch user.";
      });

    // ── Password reset request ──
    builder
      .addCase(requestPasswordReset.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.passwordResetEmailSent = false;
        state.resetMessage = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state, action) => {
        state.isLoading = false;
        state.passwordResetEmailSent = true;
        state.resetMessage = action.payload.message;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Password reset request failed.";
      });

    // ── Password reset confirm ──
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.passwordResetSuccessful = false;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.passwordResetSuccessful = true;
        state.resetMessage = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Password reset failed.";
      });
  },
});

export const {
  logout,
  clearAuthError,
  clearPasswordResetState,
  setCredentials,
} = authSlice.actions;
export default authSlice.reducer;
