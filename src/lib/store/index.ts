// src/lib/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/lib/store/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
