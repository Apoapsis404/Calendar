import { api } from "../config/axiosInstance";

export type RecurringType = "daily" | "weekly" | "monthly" | "yearly";

export interface CalendarEvent {
  event_id: string;
  user_id: string;
  event_name: string;
  description: string;
  recurring: RecurringType | null;
  custom_recurring: number | null;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export const getEvents = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    const response = await api.get<CalendarEvent[]>(`/events/${userId}`);
    console.log("Fetched events:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};
