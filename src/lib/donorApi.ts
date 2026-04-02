import apiClient from "./apiClient";
import { AxiosError } from "axios";
import {
  Donor,
  BloodGroup,
  DonorStatus,
  DonationRecord,
  BloodRequest,
  DonorSettings,
} from "@/types/donor";
import { createAppError } from "@/lib/errorHandler";

interface BackendUser {
  _id: string;
  fullName: string;
  avatar?: string;
  email: string;
  bloodGroup: BloodGroup;
  verified?: boolean;
  status?: DonorStatus;
  phone: string;
  city: string;
  district: string;
  country: string;
  isAvailable?: boolean;
  lastDonation?: string | null;
  nextEligibleAt?: string;
  totalDonations?: number;
  livesImpacted?: number;
  totalLitersDoanted?: number;
  donationHistory?: DonationRecord[];
  requestsMade?: BloodRequest[];
  memberSince?: string;
  bio?: string;
  age?: number;
  weight?: number;
  gender?: string;
  settings?: DonorSettings;
}

interface DonorsResponse {
  donors: BackendUser[];
  totalPages: number;
  currentPage: number;
}

interface TransformedDonorsResponse {
  donors: Donor[];
  totalPages: number;
  currentPage: number;
}

const defaultSettings: DonorSettings = {
  notifications: {
    emergencyAlerts: true,
    urgentRequests: true,
    nearbyRequests: true,
    donationReminders: true,
    requestUpdates: true,
    newMessages: true,
    emailDigest: true,
    smsAlerts: true,
  },
  privacy: {
    showInSearch: true,
    showPhone: true,
    showEmail: true,
    showDonationHistory: true,
    allowDirectContact: true,
  },
};

const calculateStatus = (totalDonations?: number): DonorStatus => {
  if (typeof totalDonations !== "number") return "Super Hero";
  if (totalDonations > 10) return "Champion";
  if (totalDonations > 5) return "Starter";
  return "Super Hero";
};

const mapBackendUserToDonor = (user: BackendUser): Donor => {
  const totalDonations = user.totalDonations ?? 0;

  return {
    _id: user._id,
    fullName: user.fullName,
    avatar: user.avatar || "",
    bloodGroup: user.bloodGroup,
    verified: user.verified ?? false,
    status: user.status ?? calculateStatus(totalDonations),
    phone: user.phone,
    email: user.email,
    city: user.city,
    district: user.district,
    country: user.country,
    isAvailable: user.isAvailable ?? false,
    lastDonatedAt: user.lastDonation ?? null,
    nextEligibleAt: user.nextEligibleAt ?? "",
    totalDonations,
    livesImpacted: user.livesImpacted ?? totalDonations * 3,
    totalLitersDoanted: user.totalLitersDoanted ?? totalDonations * 0.45,
    donationHistory: user.donationHistory ?? [],
    requestsMade: user.requestsMade ?? [],
    memberSince: user.memberSince ?? new Date().toISOString(),
    bio: user.bio ?? "",
    age: user.age ?? undefined,
    weight: user.weight ?? undefined,
    gender:
      user.gender === "Male" ||
      user.gender === "Female" ||
      user.gender === "Other" ||
      user.gender === ""
        ? (user.gender as Donor["gender"])
        : undefined,
    settings: user.settings ?? defaultSettings,
  };
};

export const getDonors = async (
  page: number = 1,
  limit: number = 10,
  bloodGroup?: string,
  city?: string,
  district?: string,
  country?: string,
): Promise<TransformedDonorsResponse> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (bloodGroup) params.append("bloodGroup", bloodGroup);
  if (city) params.append("city", city);
  if (district) params.append("district", district);
  if (country) params.append("country", country);

  try {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: DonorsResponse;
    }>(`/users/nearby-donors?${params.toString()}`);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch donors");
    }

    const backendData = response.data.data;
    return {
      donors: backendData.donors.map(mapBackendUserToDonor),
      totalPages: backendData.totalPages,
      currentPage: backendData.currentPage,
    };
  } catch (error) {
    // Re-throw as typed BloodDonationError preserving Axios status info
    throw createAppError(
      error,
      "Failed to fetch donors. Please try again later.",
      {
        component: "donorApi",
        action: "getDonors",
      },
    );
  }
};

export const getDonorById = async (id: string): Promise<Donor> => {
  try {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: BackendUser;
    }>(`/users/profile/${id}`);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch donor");
    }

    return mapBackendUserToDonor(response.data.data);
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      // For unauthenticated clients, fall back to the public nearby-donors endpoint.
      const fallback = await getDonors(1, 100);
      const found = fallback.donors.find((d) => d._id === id);
      if (found) return found;
    }

    throw createAppError(
      error,
      "Failed to fetch donor profile. Please try again later.",
      {
        component: "donorApi",
        action: "getDonorById",
      },
    );
  }
};
