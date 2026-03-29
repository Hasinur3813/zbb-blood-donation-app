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
  const { user, isAuthenticated, isLoading, error, accessToken } = useAppSelector(
    (state) => state.auth
  );

  const login = useCallback(
    (credentials: LoginRequest) => dispatch(loginUser(credentials)),
    [dispatch]
  );

  const register = useCallback(
    (data: RegisterRequest) => dispatch(registerUser(data)),
    [dispatch]
  );

  const loadUser = useCallback(() => dispatch(fetchCurrentUser()), [dispatch]);

  const signOut = useCallback(() => dispatch(logout()), [dispatch]);

  const clearError = useCallback(() => dispatch(clearAuthError()), [dispatch]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    accessToken,

    // Actions
    login,
    register,
    loadUser,
    signOut,
    clearError,
  } as const;
}
