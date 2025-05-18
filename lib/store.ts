import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/lib/store/authSlice";
import profileImageReducer from "@/features/profileImage/profileImageSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profileImage: profileImageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
