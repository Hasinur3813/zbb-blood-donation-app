"use client";

// hooks/useDonors.ts
import { fetchDonors, useAppDispatch, useAppSelector } from "@/store";
import { useEffect } from "react";

export const useDonors = (autoFetch = true) => {
  const dispatch = useAppDispatch();

  const state = useAppSelector((state) => state.donors);

  useEffect(() => {
    if (autoFetch) {
      dispatch(
        fetchDonors({
          page: state.currentPage,
          limit: 4, // or whatever default limit
          ...state.filters,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    autoFetch,
    state.currentPage,
    state.filters.bloodGroup,
    state.filters.city,
    state.filters.district,
    state.filters.country,
  ]);

  const refetch = () =>
    dispatch(
      fetchDonors({
        page: state.currentPage,
        limit: 12,
        ...state.filters,
      }),
    );
  // state are contains

  // donors,
  // loading,
  // error,
  // totalPages,
  // currentPage,
  // filters,
  return {
    ...state,
    refetch,
  };
};
