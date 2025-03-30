import {
  loginUser,
  logoutUser,
  registerUser,
} from "@/modules/users/userActions";
import { UserNode } from "@/nodes/user-node";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: UserNode | null;
  isLoading: boolean;
  error: string | null;
  success: boolean; // New success flag
  successMessage: string | null; // Optional success message
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
  success: false,
  successMessage: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserNode | null>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.success = false;
    },
    resetSuccess: (state) => {
      state.success = false;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.success = true;
      state.successMessage = "Login successful";
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
    });

    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.isLoading = false;
      state.success = true;
      state.successMessage = "Registration successful";
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
    });

    // Logout
    builder.addCase(logoutUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isLoading = false;
      state.user = null;
      state.success = true;
      state.successMessage = "Logout successful";
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
    });
  },
});

export const { setUser, setLoading, setError, resetSuccess } =
  userSlice.actions;
export default userSlice.reducer;
