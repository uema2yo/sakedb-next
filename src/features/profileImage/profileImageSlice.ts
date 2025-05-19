import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface ProfileImageState {
  url: string | "";
}

const initialState: ProfileImageState = {
  url: "",
};

const profileImageSlice = createSlice({
  name: "profileImage",
  initialState,
  reducers: {
    setProfileImageUrl(state, action: PayloadAction<string>) {
      state.url = action.payload;
    },
    clearProfileImageUrl(state) {
      state.url = "";
    },    
  },
});

export const { setProfileImageUrl, clearProfileImageUrl } = profileImageSlice.actions;
export default profileImageSlice.reducer;
