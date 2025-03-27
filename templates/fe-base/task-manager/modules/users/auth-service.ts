import { UserNode } from "@/nodes/user-node";
import { user_api } from "../../_core/api-client";
import { localStorageUtil } from "@/_core/utils";
import { APP_KEYS } from "@/_core/keys";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
}

interface AuthResponse {
  token: string;
  user: UserNode;
}

export const AuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await user_api.post("/user/login", credentials);

    if (response.data.token) {
      localStorageUtil.setItem(APP_KEYS.TOKEN, response.data.token);
    }

    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await user_api.post("/user/register", data);

    if (response.data.token) {
      localStorageUtil.setItem(APP_KEYS.TOKEN, response.data.token);
    }

    return response.data;
  },

  logout: async (): Promise<void> => {
    localStorageUtil.removeItem(APP_KEYS.TOKEN);
  },

  getCurrentUser: async (): Promise<UserNode | null> => {
    try {
      const token = localStorageUtil.getItem<string>(APP_KEYS.TOKEN);
      if (!token) {
        return null;
      }

      const response = await user_api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      localStorageUtil.removeItem(APP_KEYS.TOKEN);
      return null;
    }
  },
};
