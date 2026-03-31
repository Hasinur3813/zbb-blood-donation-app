// types/auth.ts

import type { BloodGroup, Gender } from "./donor";

// ── User Role ─────────────────────────────────────────────────────────────────
export type UserRole = "donor" | "recipient" | "admin";

// ── Auth User (what we store in Redux) ────────────────────────────────────────
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  bloodGroup: BloodGroup;
  gender: Gender;
  role: UserRole;
  verified: boolean;
  city: string;
  district: string;
  country: string;
  memberSince: string;
}

// ── Auth State ────────────────────────────────────────────────────────────────
export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  passwordResetEmailSent: boolean;
  passwordResetSuccessful: boolean;
  resetMessage: string | null;
}

// ── API Request / Response DTOs ───────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  bloodGroup: BloodGroup;
  gender: Gender;
  city: string;
  district: string;
  country: string;
  lastDonation?: Date | null; // ISO date string
  agreedToTerms: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}
