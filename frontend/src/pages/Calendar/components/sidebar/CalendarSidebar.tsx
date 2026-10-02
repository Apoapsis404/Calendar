import { useMemo, useState } from "react";
import type { CalendarEvent } from "../../../../api/services/calendar";
import { getCurrentUserIdFromStorage } from "../../../../context/getUserID";
import { useCreateEvent } from "../../hooks/useCreateEvent";
import { formatLocalDateKey } from "../../formatLocalDateKey";
import { CalendarSidebarItem } from "./CalendarSidebarItem";

type CalendarSidebarProps = {
  isOpen: boolean;
  selectedDate: string;
  events: CalendarEvent[];
  onClose: () => void;
  onDateChange: (date: string) => void;
  onEventsChange: (events: CalendarEvent[]) => void;
};

const STORAGE_KEY = "calendar-events";

const persistEventsToStorage = (updatedEvents: CalendarEvent[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
  } catch (error) {
    console.error("Failed to save calendar events:", error);
  }
};

const formatSidebarDate = (value: string): string => {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
};

const createDateTimeValue = (
  selectedDate: string,
  hour: number,
  minute: number,
): string => {
  const date = new Date(`${selectedDate}T00:00:00`);
  date.setHours(hour, minute, 0, 0);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}:00`;
};

export const CalendarSidebar = ({
  isOpen,
  selectedDate,
  events,
  onDateChange,
  onEventsChange,
}: CalendarSidebarProps) => {
  const { createEvent: createCalendarEvent, loading, error } = useCreateEvent();
  const [draftEvents, setDraftEvents] = useState<CalendarEvent[]>([]);

  const dayEvents = useMemo(
    () =>
      [...draftEvents, ...events].filter(
        (event, index, all) =>
          (event.start_time ?? "").slice(0, 10) === selectedDate &&
          all.findIndex(
            (candidate) =>
              candidate.event_id === event.event_id &&
              candidate.start_time === event.start_time &&
              candidate.end_time === event.end_time,
          ) === index,
      ),
    [draftEvents, events, selectedDate],
  );

  const handleSaveEvent = async (event: CalendarEvent) => {
    const userId = getCurrentUserIdFromStorage();
    if (!userId) {
      console.error("No user ID found for event creation.");
      return;
    }

    const payload = {
      user_id: userId,
      event_name: event.event_name.trim() || "New event",
      description: event.description || "",
      recurring: null,
      custom_recurring: null,
      start_time: event.start_time,
      end_time: event.end_time,
    };

    const createdEvent = await createCalendarEvent(payload);
    if (!createdEvent) {
      return;
    }

    const nextEvents = [...events, createdEvent];
    onEventsChange(nextEvents);
    persistEventsToStorage(nextEvents);
    setDraftEvents((current) => [...current, createdEvent]);
  };

  const handleDeleteEvent = (eventId: string) => {
    const nextEvents = events.filter((event) => event.event_id !== eventId);
    onEventsChange(nextEvents);
    persistEventsToStorage(nextEvents);
    setDraftEvents((current) =>
      current.filter((event) => event.event_id !== eventId),
    );
  };

  const addNewEvent = () => {
    const now = new Date();
    const draftEvent: CalendarEvent = {
      event_id: "",
      event_name: "",
      description: "",
      recurring: null,
      custom_recurring: null,
      start_time: createDateTimeValue(
        selectedDate,
        now.getHours(),
        now.getMinutes(),
      ),
      end_time: createDateTimeValue(
        selectedDate,
        now.getHours() + 1,
        now.getMinutes(),
      ),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setDraftEvents((current) => [...current, draftEvent]);
  };

  const changeSelectedDate = (increment: number) => {
    const nextDate = new Date(`${selectedDate}T00:00:00`);
    nextDate.setDate(nextDate.getDate() + increment);
    onDateChange(formatLocalDateKey(nextDate));
  };

  return (
    <aside
      className={[
        "w-[var(--calendar-sidebar-width)] max-w-full shrink-0 overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-bg)] shadow-[0_20px_45px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out",
        isOpen
          ? "translate-x-0 opacity-100"
          : "pointer-events-none translate-x-full opacity-0",
      ].join(" ")}
      aria-hidden={!isOpen}
    >
      <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-white px-4 py-3">
        <button
          type="button"
          className="rounded-md border border-[var(--color-border)] bg-white px-2 py-1 text-sm font-medium text-[var(--color-text-h)] transition hover:bg-[var(--color-accent-bg)]"
          onClick={() => changeSelectedDate(-1)}
          aria-label="Previous day"
        >
          ←
        </button>

        <span className="text-lg font-semibold text-[var(--color-text-h)]">
          {formatSidebarDate(selectedDate)}
        </span>

        <button
          type="button"
          className="rounded-md border border-[var(--color-border)] bg-white px-2 py-1 text-sm font-medium text-[var(--color-text-h)] transition hover:bg-[var(--color-accent-bg)]"
          onClick={() => changeSelectedDate(1)}
          aria-label="Next day"
        >
          →
        </button>
      </div>

      <div className="max-h-[70vh] overflow-y-auto bg-[var(--color-bg)] px-4 py-4">
        {dayEvents.length ? (
          <div className="space-y-4">
            {dayEvents.map((event, index) => (
              <div
                key={`${event.event_id || "draft"}-${event.start_time}-${event.end_time}-${index}`}
              >
                <CalendarSidebarItem
                  event={event}
                  onSave={handleSaveEvent}
                  onDelete={handleDeleteEvent}
                />
                {index < dayEvents.length - 1 && (
                  <div className="mt-4 border-t-2 border-[var(--color-border)]" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-accent-bg)] p-4 text-sm text-[var(--color-text)]">
            No events for this date.
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error.message}
          </div>
        )}

        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={addNewEvent}
            disabled={loading}
            className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add new event"}
          </button>
        </div>
      </div>
    </aside>
  );
};
