import { logout } from "../../../api/services/auth";

export const logoutUser = async (): Promise<void> => {
  try {
    await logout();
    localStorage.removeItem("loginUser");
    localStorage.removeItem("userId");
    window.location.href = "/";
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};
