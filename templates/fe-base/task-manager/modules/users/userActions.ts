import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "./auth-service";

export const loginUser = createAsyncThunk(
  "user/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await AuthService.login({ email, password });
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to login"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (
    {
      name,
      email,
      password,
    }: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await AuthService.register({ name, email, password });
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to register"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.logout();
      return null;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to logout"
      );
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  "user/checkStatus",
  async () => {
    const currentUser = AuthService.getCurrentUser();
    return currentUser;
  }
);
