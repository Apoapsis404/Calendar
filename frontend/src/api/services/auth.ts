import { api } from "../config/axiosInstance";

export interface LoginUser {
  user_id: string;
  username: string;
  email: string;
  refreshToken: string;
}

export interface LoginUserData {
  username: string;
  password: string;
}

export const login = async (loginData: LoginUserData): Promise<LoginUser> => {
  const response = await api.post<LoginUser>(`/login`, loginData);
  return response.data;
};

export const logout = async (): Promise<void> => {
  const loginUser = localStorage.getItem("loginUser");
  if (!loginUser) {
    throw new Error("No user is currently logged in.");
  }
  const { refreshToken } = JSON.parse(loginUser) as LoginUser;
  await api.delete(`/refresh`, {
    headers: { Authorization: `Bearer ${refreshToken}` },
  });
};

export interface RegisterUserData {
  username: string;
  email: string;
  password: string;
}

export interface RegisterUserResponse {
  user_id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export const register = async (
  registerData: RegisterUserData,
): Promise<RegisterUserResponse> => {
  const response = await api.post<RegisterUserResponse>(
    `/register`,
    registerData,
  );
  return response.data;
};
