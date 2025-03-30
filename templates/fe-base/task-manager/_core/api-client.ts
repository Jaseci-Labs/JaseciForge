import axios from "axios";
import { APP_KEYS } from "./keys";

// Get the API URL from environment variables
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Create a basic axios instance for user API calls (no auth)
export const user_api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create an axios instance for walker API calls (with auth)
export const walker_api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach Bearer token from localStorage
walker_api.interceptors.request.use(
  (config) => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(APP_KEYS.TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
const handleResponseError = (error: any) => {
  if (error.response) {
    // Handle specific error status codes
    if (error.response.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        // Could redirect to login page here
      }
    }
  }
  return Promise.reject(error);
};

user_api.interceptors.response.use((response) => response, handleResponseError);
walker_api.interceptors.response.use(
  (response) => response,
  handleResponseError
);


