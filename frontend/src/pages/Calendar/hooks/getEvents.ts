import { useCallback, useEffect, useState } from "react";
import { getEvents, type CalendarEvent } from "../../../api/services/calendar";

export interface EventResult {
  events: CalendarEvent[];
  loading: boolean;
  error: Error | null;
}

export const useGetEvents = (userID: string): EventResult => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const loadEvents = useCallback(async () => {
    if (!userID) {
      setEvents([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const fetchedEvents = await getEvents(userID);
      console.log("Fetched events in useGetEvents:", fetchedEvents);
      setEvents(fetchedEvents);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userID]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadEvents();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loadEvents]);

  return { events, loading, error };
};
