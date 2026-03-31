"use client";

import { useCallback } from "react";
import {
  useAppDispatch,
  useAppSelector,
  loginUser,
  registerUser,
  fetchCurrentUser,
  logout,
  clearAuthError,
  requestPasswordReset as requestPasswordResetThunk,
  resetPassword as resetPasswordThunk,
  clearPasswordResetState,
} from "@/store";
import type { LoginRequest, RegisterRequest } from "@/types/auth";

/**
 * Convenience hook that exposes the full auth surface in one call.
 *
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    accessToken,
    passwordResetEmailSent,
    passwordResetSuccessful,
    resetMessage,
  } = useAppSelector((state) => state.auth);

  const login = useCallback(
    (credentials: LoginRequest) => dispatch(loginUser(credentials)),
    [dispatch],
  );

  const register = useCallback(
    (data: RegisterRequest) => dispatch(registerUser(data)),
    [dispatch],
  );

  const loadUser = useCallback(() => dispatch(fetchCurrentUser()), [dispatch]);

  const requestPasswordReset = useCallback(
    (payload: { email: string }) =>
      dispatch(requestPasswordResetThunk(payload)),
    [dispatch],
  );

  const resetPassword = useCallback(
    (payload: { token: string; password: string }) =>
      dispatch(resetPasswordThunk(payload)),
    [dispatch],
  );

  const signOut = useCallback(() => dispatch(logout()), [dispatch]);

  const clearError = useCallback(() => dispatch(clearAuthError()), [dispatch]);

  const clearPasswordReset = useCallback(
    () => dispatch(clearPasswordResetState()),
    [dispatch],
  );

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    accessToken,
    passwordResetEmailSent,
    passwordResetSuccessful,
    resetMessage,

    // Actions
    login,
    register,
    loadUser,
    requestPasswordReset,
    resetPassword,
    signOut,
    clearError,
    clearPasswordReset,
  } as const;
}
