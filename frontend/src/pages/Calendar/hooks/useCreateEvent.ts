import { useCallback, useState } from "react";
import {
  createEvent,
  type CalendarEvent,
  type CreateEvent,
} from "../../../api/services/calendar";

export interface CreateEventResult {
  event: CalendarEvent | null;
  loading: boolean;
  error: Error | null;
  createEvent: (payload: CreateEvent) => Promise<CalendarEvent | null>;
}

export const useCreateEvent = (): CreateEventResult => {
  const [event, setEvent] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const createNewEvent = useCallback(
    async (payload: CreateEvent): Promise<CalendarEvent | null> => {
      setLoading(true);
      setError(null);

      try {
        const newEvent = await createEvent(payload);
        setEvent(newEvent);
        return newEvent;
      } catch (err) {
        const nextError =
          err instanceof Error ? err : new Error("Failed to create event.");
        setError(nextError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { event, loading, error, createEvent: createNewEvent };
};
