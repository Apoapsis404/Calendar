import { useCallback, useEffect, useState } from "react";
import { getDays, type Day } from "../../../api/services/calendar";

export interface DayResult {
  days: Day[];
  loading: boolean;
  error: Error | null;
}

const CALENDAR_DAYS_STORAGE_KEY = "calendarDays";

export const getCurrentUserIdFromStorage = (): string => {
  const loginUser = localStorage.getItem("loginUser");

  if (!loginUser) {
    throw new Error("No loginUser found in localStorage");
  }

  try {
    const parsedUser = JSON.parse(loginUser) as { user_id?: string | null };
    return (
      parsedUser.user_id ??
      (() => {
        throw new Error("No user_id found in loginUser");
      })()
    );
  } catch {
    throw new Error("Failed to parse loginUser from localStorage");
  }
};

export const saveDatesToLocalStorage = (
  days: Day[],
  userId: string | null = getCurrentUserIdFromStorage(),
): Record<string, Day[]> => {
  if (!userId) {
    return {};
  }

  const daysByMonth: Record<string, Day[]> = {};

  for (const day of days) {
    const normalizedDate = day.reference_date?.trim();

    if (!normalizedDate || !normalizedDate.includes("-")) {
      continue;
    }

    const monthKey = normalizedDate.slice(0, 7);

    if (!monthKey || !/^\d{4}-\d{2}$/.test(monthKey)) {
      continue;
    }

    if (!daysByMonth[monthKey]) {
      daysByMonth[monthKey] = [];
    }

    daysByMonth[monthKey].push(day);
  }

  localStorage.setItem(
    `${CALENDAR_DAYS_STORAGE_KEY}:${userId}`,
    JSON.stringify(daysByMonth),
  );

  return daysByMonth;
};

export const getDatesForMonthFromLocalStorage = (
  monthKey: string,
  userId: string | null = getCurrentUserIdFromStorage(),
): Day[] => {
  if (!monthKey || !userId) {
    return [];
  }

  try {
    const storedValue = localStorage.getItem(
      `${CALENDAR_DAYS_STORAGE_KEY}:${userId}`,
    );

    if (!storedValue) {
      return [];
    }

    const daysByMonth = JSON.parse(storedValue) as Record<string, Day[]>;
    return Array.isArray(daysByMonth[monthKey]) ? daysByMonth[monthKey] : [];
  } catch {
    return [];
  }
};

export const useGetDays = (userId: string): DayResult => {
  const [days, setDays] = useState<Day[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const loadDays = useCallback(async () => {
    if (!userId) {
      setDays([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getDays();
      saveDatesToLocalStorage(response, userId);
      setDays(response);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred"),
      );
      setDays([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadDays();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loadDays]);

  return {
    days,
    loading,
    error,
  };
};
