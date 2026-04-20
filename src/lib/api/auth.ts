import apiClient from "./client";
import { User } from "@/types";

interface LoginInput {
  phone?: string;
  email?: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: async (payload: LoginInput): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  me: async (): Promise<User> => {
    const { data } = await apiClient.get<{ data: User }>("/auth/me");
    return data.data ?? (data as unknown as User);
  },
};
