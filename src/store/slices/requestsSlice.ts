import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/lib/apiClient";

interface BloodRequest {
  _id: string;
  requestNumber: string;
  requesterId: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    bloodGroup: string;
  };
  patientName: string;
  patientAge: number;
  patientGender: "male" | "female" | "other";
  patientCondition: string;
  bloodGroup: string;
  unitsRequired: number;
  componentType: "whole_blood" | "platelets" | "plasma" | "red_cells";
  hospital: string;
  division: string;
  district: string;
  ward?: string;
  doctorName: string;
  doctorContact?: string;
  urgencyLevel: "normal" | "urgent" | "emergency";
  requiredBy: string;
  requiredByTime?: string;
  specialInstructions?: string;
  requesterName: string;
  relation: string;
  contactPhone: string;
  alternatePhone?: string;
  contactEmail?: string;
  status: "pending" | "matched" | "completed" | "cancelled" | "expired";
  matchedDonorId?: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    bloodGroup: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateRequestData {
  patientName: string;
  patientAge: string;
  patientGender: "male" | "female" | "other";
  patientCondition: string;
  bloodGroup: string;
  unitsRequired: string;
  componentType: "whole_blood" | "platelets" | "plasma" | "red_cells";
  hospital: string;
  division: string;
  district: string;
  ward?: string;
  doctorName: string;
  doctorContact?: string;
  urgencyLevel: "normal" | "urgent" | "emergency";
  requiredBy: string;
  requiredByTime?: string;
  specialInstructions?: string;
  requesterName: string;
  relation: string;
  contactPhone: string;
  alternatePhone?: string;
  contactEmail?: string;
  notes?: string;
}

interface RequestsState {
  requests: BloodRequest[];
  currentRequest: BloodRequest | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  totalRequests: number;
}

const initialState: RequestsState = {
  requests: [],
  currentRequest: null,
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  totalRequests: 0,
};

// Create blood donation request
export const createBloodRequest = createAsyncThunk<
  BloodRequest,
  CreateRequestData,
  { rejectValue: string }
>("requests/createBloodRequest", async (requestData, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: BloodRequest;
    }>("/requests", requestData);

    if (!response.data.success) {
      return rejectWithValue(
        response.data.message || "Failed to create request",
      );
    }

    return response.data.data;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create blood request";
    return rejectWithValue(message);
  }
});

// Get all requests with filters
export const fetchRequests = createAsyncThunk<
  {
    requests: BloodRequest[];
    totalPages: number;
    currentPage: number;
    totalRequests: number;
  },
  | {
      page?: number;
      limit?: number;
      bloodGroup?: string;
      urgencyLevel?: string;
      status?: string;
      hospital?: string;
      division?: string;
      district?: string;
    }
  | undefined,
  { rejectValue: string }
>("requests/fetchRequests", async (params = {}, { rejectWithValue }) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.bloodGroup) queryParams.append("bloodGroup", params.bloodGroup);
    if (params?.urgencyLevel)
      queryParams.append("urgencyLevel", params.urgencyLevel);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.hospital) queryParams.append("hospital", params.hospital);
    if (params?.division) queryParams.append("division", params.division);
    if (params?.district) queryParams.append("district", params.district);

    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: {
        requests: BloodRequest[];
        totalPages: number;
        currentPage: number;
        totalRequests: number;
      };
    }>(`/requests?${queryParams.toString()}`);

    if (!response.data.success) {
      return rejectWithValue(
        response.data.message || "Failed to fetch requests",
      );
    }

    return response.data.data;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch requests";
    return rejectWithValue(message);
  }
});

// Get single request
export const fetchRequest = createAsyncThunk<
  BloodRequest,
  string,
  { rejectValue: string }
>("requests/fetchRequest", async (requestId, { rejectWithValue }) => {
  try {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: BloodRequest;
    }>(`/requests/${requestId}`);

    if (!response.data.success) {
      return rejectWithValue(
        response.data.message || "Failed to fetch request",
      );
    }

    return response.data.data;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch request";
    return rejectWithValue(message);
  }
});

// Get user's own requests
export const fetchMyRequests = createAsyncThunk<
  {
    requests: BloodRequest[];
    totalPages: number;
    currentPage: number;
    totalRequests: number;
  },
  { page?: number; limit?: number } | undefined,
  { rejectValue: string }
>("requests/fetchMyRequests", async (params = {}, { rejectWithValue }) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: {
        requests: BloodRequest[];
        totalPages: number;
        currentPage: number;
        totalRequests: number;
      };
    }>(`/requests/my-requests?${queryParams.toString()}`);

    if (!response.data.success) {
      return rejectWithValue(
        response.data.message || "Failed to fetch your requests",
      );
    }

    return response.data.data;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch your requests";
    return rejectWithValue(message);
  }
});

// Update request status
export const updateRequestStatus = createAsyncThunk<
  BloodRequest,
  {
    requestId: string;
    status: string;
    matchedDonorId?: string;
    notes?: string;
  },
  { rejectValue: string }
>(
  "requests/updateRequestStatus",
  async ({ requestId, ...updateData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<{
        success: boolean;
        message: string;
        data: BloodRequest;
      }>(`/requests/${requestId}`, updateData);

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to update request",
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update request";
      return rejectWithValue(message);
    }
  },
);

const requestsSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentRequest: (state) => {
      state.currentRequest = null;
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create request
      .addCase(createBloodRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBloodRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requests.unshift(action.payload); // Add to beginning of list
        state.totalRequests += 1;
      })
      .addCase(createBloodRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch requests
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload.requests;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalRequests = action.payload.totalRequests;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch single request
      .addCase(fetchRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRequest = action.payload;
      })
      .addCase(fetchRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch my requests
      .addCase(fetchMyRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload.requests;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalRequests = action.payload.totalRequests;
      })
      .addCase(fetchMyRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update request status
      .addCase(updateRequestStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.requests.findIndex(
          (req) => req._id === action.payload._id,
        );
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
        if (state.currentRequest?._id === action.payload._id) {
          state.currentRequest = action.payload;
        }
      })
      .addCase(updateRequestStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentRequest, setPage } =
  requestsSlice.actions;
export default requestsSlice.reducer;
