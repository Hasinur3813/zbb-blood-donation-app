// hooks/useRequests.ts
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import { fetchRequests, type AppDispatch, type RootState } from "@/store";

type UseRequestsOptions = {
  bloodFilter?: string;
  urgencyFilter?: string;
  autoFetch?: boolean;
  limit?: number;
};

export const useRequests = ({
  autoFetch = true,
  limit = 4,
}: UseRequestsOptions = {}) => {
  const dispatch = useDispatch<AppDispatch>();

  const state = useSelector((state: RootState) => state.requests);

  const { currentPage } = state;

  const fetchData = async () => {
    const params: {
      page?: number;
      limit?: number;
      status?: string;
    } = {
      page: currentPage,
      limit,
      status: "pending",
    };

    try {
      await dispatch(fetchRequests(params)).unwrap();
    } catch (err) {
      const message =
        typeof err === "string" ? err : "Failed to load blood requests";
      toast.error(message);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, autoFetch]);

  return {
    ...state,
    refetch: fetchData,
  };
};
