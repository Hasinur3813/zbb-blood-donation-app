// hooks/useRequests.ts
"use client";

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchRequests, type AppDispatch, type RootState } from "@/store";
import { useErrorToast } from "@/components/ErrorToast/ErrorToastProvider";

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
  const { showError } = useErrorToast();

  const state = useSelector((state: RootState) => state.requests);
  const { currentPage } = state;

  const fetchData = useCallback(async () => {
    try {
      await dispatch(
        fetchRequests({
          page: currentPage,
          limit,
          status: "pending",
        })
      ).unwrap();
    } catch (err) {
      // Use the global error toast system — err is already rejectValue string
      // but we call showError to route through the full handler pipeline.
      showError(
        typeof err === "string" ? new Error(err) : err,
        { component: "useRequests", action: "fetchRequests" }
      );
    }
  }, [dispatch, currentPage, limit, showError]);

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
