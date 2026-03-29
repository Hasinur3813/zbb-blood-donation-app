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
}

// ── API Request / Response DTOs ───────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  bloodGroup: BloodGroup;
  gender: Gender;
  city: string;
  district: string;
  country: string;
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
