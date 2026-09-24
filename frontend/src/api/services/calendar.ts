import { api } from "../config/axiosInstance";

export interface Day {
  day_id: string;
  reference_date: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const getDays = async (): Promise<Day[]> => {
  const userId = localStorage.getItem("loginUser")
    ? JSON.parse(localStorage.getItem("loginUser") as string).user_id
    : null;
  if (!userId) {
    throw new Error("User ID not found in local storage");
  }
  const response = await api.get<Day[]>(`/days/${userId}`);
  return response.data;
};
