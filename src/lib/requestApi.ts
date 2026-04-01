import apiClient from "./apiClient";
import { Request as DonationRequest } from "@/types/Request";
import { createAppError } from "@/lib/errorHandler";

interface RequestsResponse {
  requests: DonationRequest[];
  totalPages: number;
  currentPage: number;
}

export const getDonationRequests = async (
  page: number = 1,
  limit: number = 10,
  bloodGroup?: string,
  urgency?: string,
  status?: string,
): Promise<RequestsResponse> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (bloodGroup) params.append("bloodGroup", bloodGroup);
  if (urgency) params.append("urgency", urgency);
  if (status) params.append("status", status);

  try {
    const response = await apiClient.get(`/requests?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    throw createAppError(error, "Failed to fetch donation requests. Please try again later.", {
      component: "requestApi",
      action: "getDonationRequests",
    });
  }
};

export const createDonationRequest = async (
  requestData: Partial<DonationRequest>,
): Promise<DonationRequest> => {
  try {
    const response = await apiClient.post("/requests", requestData);
    return response.data.data;
  } catch (error) {
    throw createAppError(error, "Failed to create donation request. Please check your input and try again.", {
      component: "requestApi",
      action: "createDonationRequest",
    });
  }
};

export const getMyDonationRequests = async (
  page: number = 1,
  limit: number = 10,
): Promise<RequestsResponse> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  try {
    const response = await apiClient.get(
      `/requests/my-requests?${params.toString()}`,
    );
    return response.data.data;
  } catch (error) {
    throw createAppError(error, "Failed to fetch your donation requests. Please try again later.", {
      component: "requestApi",
      action: "getMyDonationRequests",
    });
  }
};
