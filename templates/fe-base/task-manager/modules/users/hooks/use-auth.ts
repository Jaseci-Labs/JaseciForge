"use client";
import useAppNavigation from "@/_core/hooks/useAppNavigation";
import { useEffect, useCallback } from "react";
import { AuthService } from "../auth-service";
import { useAppDispatch, useAppSelector } from "@/store/useStore";
import { setUser, resetSuccess } from "@/store/userSlice";
import { loginUser, logoutUser, registerUser } from "../userActions";

export function useAuth() {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users);
  const router = useAppNavigation();

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = AuthService.getCurrentUser();
      dispatch(setUser(currentUser));
    };
    checkAuth();
  }, [dispatch]);

  // Handle navigation based on success
  useEffect(() => {
    if (users.success) {
      if (users.successMessage === "Login successful") {
        router.navigate("/");
      } else if (users.successMessage === "Registration successful") {
        router.navigate("/auth/login");
      } else if (users.successMessage === "Logout successful") {
        router.navigate("/auth/login");
      }
      dispatch(resetSuccess());
    }
  }, [users.success, users.successMessage, router, dispatch]);

  const login = useCallback(
    async (email: string, password: string) => {
      dispatch(loginUser({ email, password }));
    },
    [dispatch]
  );

  const register = useCallback(
    async (email: string, password: string) => {
      console.log("registering");
      dispatch(registerUser({ email, password }));
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    dispatch(logoutUser());
  }, [dispatch]);

  return {
    login,
    register,
    logout,
    isLoading: users.isLoading,
    error: users.error,
    data: users.user,
    success: users.success,
    successMessage: users.successMessage,
  };
}
