"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector, fetchCurrentUser } from "@/store";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { user, accessToken, isLoading } = useAppSelector((state) => state.auth);
  const initialized = useRef(false);

  useEffect(() => {
    // Only run once on mount
    if (initialized.current) return;
    initialized.current = true;

    // If we have a token but no user object, fetch the user profile
    if (accessToken && !user && !isLoading) {
      dispatch(fetchCurrentUser());
    }
  }, [accessToken, user, isLoading, dispatch]);

  return <>{children}</>;
}
