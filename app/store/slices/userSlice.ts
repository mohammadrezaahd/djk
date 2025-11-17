import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "../types";
import type { ICurrentUserResponse } from "~/types/interfaces/auth.interface";

interface UserState {
  currentUser: ICurrentUserResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<ICurrentUserResponse>) => {
      state.currentUser = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUserError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { setUser, setUserLoading, setUserError, clearUser } =
  userSlice.actions;

export default userSlice.reducer;
