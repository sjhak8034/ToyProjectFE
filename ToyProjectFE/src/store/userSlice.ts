// store/userSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type UserProfileResponseDto } from "../api/users";
interface UserState extends UserProfileResponseDto {}


const initialState: UserState = {
  id: null,
  username: null,
  nickname: null,
  picture: null,
  email: null,
  createdAt: null,
  updatedAt: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserProfileResponseDto >) {
      return { ...state, ...action.payload };
    },
    clearUser() {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
