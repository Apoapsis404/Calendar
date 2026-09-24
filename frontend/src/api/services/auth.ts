import { api } from "../config/axiosInstance";

export interface Login {
  user_id: string;
  username: string;
  email: string;
  refreshToken: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export const login = async (loginData: LoginData): Promise<Login> => {
  const response = await api.post<Login>(`/login`, loginData);
  return response.data;
};
