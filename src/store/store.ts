import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";

import authReducer from "./slices/authSlice";

// ── Store ─────────────────────────────────────────────────────────────────────

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add more slices here as the app grows, e.g.:
    // donors: donorsReducer,
    // requests: requestsReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

// ── Type helpers ──────────────────────────────────────────────────────────────

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ── Typed hooks (use these throughout the app instead of plain useDispatch / useSelector)
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
