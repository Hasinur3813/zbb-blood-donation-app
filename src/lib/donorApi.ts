import apiClient from "./apiClient";
import { Donor, BloodGroup } from "@/types/donor";
import { createAppError } from "@/lib/errorHandler";

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
  donors: Donor[];
  totalPages: number;
  currentPage: number;
}

interface TransformedDonorsResponse {
  donors: Donor[];
  totalPages: number;
  currentPage: number;
}

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
      donors: backendData.donors,
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
