// types/donor.ts

import { StaticImport } from "next/dist/shared/lib/get-img-props";

export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export type DonationStatus = "COMPLETED" | "EXPIRED" | "SCHEDULED";
export type RequestUrgency = "URGENT" | "EMERGENCY" | "NORMAL";
export type RequestStatus = "ACTIVE" | "FULFILLED" | "EXPIRED";
export type DonorStatus = "Starter" | "Champion" | "Super Hero";
export type Gender = "Male" | "Female" | "Other" | "";
export type DonationType =
  | "Whole Blood"
  | "Platelets"
  | "Plasma"
  | "Double Red Cells";

// ── Settings ──────────────────────────────────────────────────────────────────

export interface NotificationSettings {
  emergencyAlerts: boolean;
  urgentRequests: boolean;
  nearbyRequests: boolean;
  donationReminders: boolean;
  requestUpdates: boolean;
  newMessages: boolean;
  emailDigest: boolean;
  smsAlerts: boolean;
}

export interface PrivacySettings {
  showInSearch: boolean;
  showPhone: boolean;
  showEmail: boolean;
  showDonationHistory: boolean;
  allowDirectContact: boolean;
}

export interface DonorSettings {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

// ── Sub-documents ─────────────────────────────────────────────────────────────

export interface DonationRecord {
  _id: string;
  location: string;
  type: DonationType;
  date: string; // ISO
  status: DonationStatus;
}

export interface BloodRequest {
  _id: string;
  requestNo: string;
  bloodGroup: BloodGroup;
  reason: string;
  hospital: string;
  urgency: RequestUrgency;
  respondedDonors: number;
  createdAt: string; // ISO
  status: RequestStatus;
}

// ── Main Donor type ───────────────────────────────────────────────────────────

export interface Donor {
  // Identity
  _id: string;
  fullName: string;
  avatar: string | StaticImport;
  bloodGroup: BloodGroup;
  verified: boolean;
  status: DonorStatus;

  // Contact
  phone: string;
  email: string;
  city: string;
  district: string;
  country: string;

  // Availability
  isAvailable: boolean;
  lastDonatedAt: string | null;
  nextEligibleAt: string;

  // Stats
  totalDonations: number;
  livesImpacted: number;
  totalLitersDoanted: number;

  // History & Requests
  donationHistory: DonationRecord[];
  requestsMade: BloodRequest[];

  // Meta
  memberSince: string;
  bio: string | undefined;
  age: number | undefined;
  weight: number | undefined;
  gender: Gender | undefined;

  // Settings
  settings: DonorSettings;
}
