import { configureStore } from "@reduxjs/toolkit";
import profileImageReducer from "@/features/profileImage/profileImageSlice";

export const store = configureStore({
  reducer: {
    profileImage: profileImageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
