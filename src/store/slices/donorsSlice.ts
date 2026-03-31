import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { getDonors } from "@/lib/donorApi";
import type { Donor } from "@/types/donor";

interface DonorsState {
  donors: Donor[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  filters: {
    bloodGroup: string;
    city: string;
    district: string;
    country: string;
  };
}

const initialState: DonorsState = {
  donors: [],
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  filters: {
    bloodGroup: "",
    city: "",
    district: "",
    country: "",
  },
};

// Helper to extract error message
function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message || error.message || "An error occurred"
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
}

export const fetchDonors = createAsyncThunk<
  { donors: Donor[]; totalPages: number; currentPage: number },
  { page?: number; limit?: number } | undefined,
  { state: { donors: DonorsState } }
>("donors/fetchDonors", async (params = {}, { getState, rejectWithValue }) => {
  const state = getState().donors;
  const { page = 1, limit = 10 } = params;
  const { bloodGroup, city, district, country } = state.filters;

  try {
    const response = await getDonors(
      page,
      limit,
      bloodGroup,
      city,
      district,
      country,
    );
    return {
      donors: response.donors,
      totalPages: response.totalPages,
      currentPage: response.currentPage,
    } as { donors: Donor[]; totalPages: number; currentPage: number };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const donorsSlice = createSlice({
  name: "donors",
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<Partial<DonorsState["filters"]>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1; // Reset to first page when filters change
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.currentPage = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDonors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDonors.fulfilled, (state, action) => {
        state.loading = false;
        state.donors = action.payload.donors;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchDonors.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch donors";
      });
  },
});

export const { setFilters, clearFilters, setPage, clearError } =
  donorsSlice.actions;
export default donorsSlice.reducer;
