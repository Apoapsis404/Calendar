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
