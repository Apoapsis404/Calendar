export const getCurrentUserIdFromStorage = (): string | null => {
  const directUserId = localStorage.getItem("userId");
  if (directUserId) return directUserId;

  const loginUser = localStorage.getItem("loginUser");
  if (!loginUser) return null;

  try {
    const parsedUser = JSON.parse(loginUser) as { user_id?: string };
    return parsedUser.user_id ?? null;
  } catch {
    return null;
  }
};
