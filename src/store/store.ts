import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";

import authReducer from "./slices/authSlice";
import donorsReducer from "./slices/donorsSlice";
import requestsReducer from "./slices/requestsSlice";

// ── Store ─────────────────────────────────────────────────────────────────────

export const store = configureStore({
  reducer: {
    auth: authReducer,
    donors: donorsReducer,
    requests: requestsReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

// ── Type helpers ──────────────────────────────────────────────────────────────

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ── Typed hooks (use these throughout the app instead of plain useDispatch / useSelector)
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
