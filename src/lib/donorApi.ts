import apiClient from "./apiClient";
import { Donor, BloodGroup } from "@/types/donor";

interface BackendUser {
  _id: string;
  fullName: string;
  email: string;
  bloodGroup: BloodGroup;
  phone: string;
  city: string;
  district: string;
  country: string;
  lastDonation: string | null;
  totalDonations: number;
  isAvailable: boolean;
  createdAt: string;
  verified?: boolean;
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

const transformUserToDonor = (user: BackendUser): Donor => {
  const lastDonatedAt = user.lastDonation || null;
  const nextEligibleAt = lastDonatedAt
    ? new Date(
        new Date(lastDonatedAt).getTime() + 90 * 24 * 60 * 60 * 1000,
      ).toISOString()
    : new Date().toISOString();

  return {
    id: user._id,
    name: user.fullName,
    avatar: "", // Backend doesn't have avatar, set to empty
    bloodGroup: user.bloodGroup,
    verified: user.verified || false,
    status:
      user.totalDonations > 10
        ? "Champion"
        : user.totalDonations > 5
          ? "Starter"
          : "Super Hero",
    phone: user.phone,
    email: user.email,
    city: user.city,
    district: user.district,
    country: user.country,
    isAvailable: user.isAvailable,
    lastDonatedAt,
    nextEligibleAt,
    totalDonations: user.totalDonations,
    livesImpacted: user.totalDonations * 3, // Estimate
    totalLitersDoanted: user.totalDonations * 0.45, // Average blood donation
    donationHistory: [], // Not available from backend
    requestsMade: [], // Not available from backend
    memberSince: user.createdAt,
    bio: "",
    age: 25, // Not available, set default
    weight: 70, // Not available, set default
    gender: "Male", // Not available, set default
    settings: {
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
        showEmail: false,
        showDonationHistory: true,
        allowDirectContact: true,
      },
    },
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
    const transformedResponse: TransformedDonorsResponse = {
      donors: backendData.donors.map(transformUserToDonor),
      totalPages: backendData.totalPages,
      currentPage: backendData.currentPage,
    };
    return transformedResponse;
  } catch (error) {
    console.error("Failed to fetch donors:", error);
    throw new Error("Failed to fetch donors. Please try again later.");
  }
};
