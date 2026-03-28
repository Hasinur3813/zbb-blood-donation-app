// types/donor.ts
export interface DonationRecord {
  id: string;
  location: string;
  type: "Whole Blood" | "Platelets" | "Plasma" | "Double Red Cells";
  date: string; // ISO
  status: "COMPLETED" | "EXPIRED" | "SCHEDULED";
}

export interface BloodRequest {
  id: string;
  requestNo: string;
  bloodGroup: string;
  reason: string;
  hospital: string;
  urgency: "URGENT" | "NORMAL" | "EMERGENCY";
  respondedDonors: number;
  createdAt: string; // ISO
  status: "ACTIVE" | "FULFILLED" | "EXPIRED";
}

export interface Donor {
  // ── Identity
  id: string;
  name: string;
  avatar: string;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  verified: boolean;
  status: "Super Hero" | "Champion" | "Starter";

  // ── Contact
  phone: string;
  email: string;
  city: string;
  district: string;
  country: string;

  // ── Availability
  isAvailable: boolean;
  lastDonatedAt: string | null; // ISO
  nextEligibleAt: string; // ISO

  // ── Stats
  totalDonations: number;
  livesImpacted: number;
  totalLitersDoanted: number;

  // ── History & Requests
  donationHistory: DonationRecord[];
  requestsMade: BloodRequest[];

  // ── Meta
  memberSince: string; // ISO
  bio: string;
  age: number;
  weight: number; // kg — relevant for eligibility
  gender: "Male" | "Female" | "Other";
}
