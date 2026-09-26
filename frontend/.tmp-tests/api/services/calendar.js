import { api } from "../config/axiosInstance";
export const getEvents = async (userId) => {
    try {
        const response = await api.get(`/events/${userId}`);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching events:", error);
        throw error;
    }
};
