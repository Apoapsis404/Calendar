import { useEffect, useState } from "react";
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
  const [dayEvents, setDayEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    setDayEvents(
      events.filter(
        (event) => (event.start_time ?? "").slice(0, 10) === selectedDate,
      ),
    );
  }, [events, selectedDate]);

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
    setDayEvents(
      nextEvents.filter(
        (item) => (item.start_time ?? "").slice(0, 10) === selectedDate,
      ),
    );
  };

  const handleDeleteEvent = (eventId: string) => {
    const nextEvents = events.filter((event) => event.event_id !== eventId);
    onEventsChange(nextEvents);
    persistEventsToStorage(nextEvents);
    setDayEvents(
      nextEvents.filter(
        (item) => (item.start_time ?? "").slice(0, 10) === selectedDate,
      ),
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

    setDayEvents((current) => [...current, draftEvent]);
  };

  const changeSelectedDate = (increment: number) => {
    const nextDate = new Date(`${selectedDate}T00:00:00`);
    nextDate.setDate(nextDate.getDate() + increment);
    onDateChange(formatLocalDateKey(nextDate));
  };

  return (
    <aside
      className={[
        "w-[360px] max-w-full shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-xl transition-all duration-300 ease-out",
        isOpen
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0 pointer-events-none",
      ].join(" ")}
      aria-hidden={!isOpen}
    >
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <button
          type="button"
          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100"
          onClick={() => changeSelectedDate(-1)}
          aria-label="Previous day"
        >
          ←
        </button>

        <span className="text-lg font-semibold text-slate-800">
          {formatSidebarDate(selectedDate)}
        </span>

        <button
          type="button"
          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100"
          onClick={() => changeSelectedDate(1)}
          aria-label="Next day"
        >
          →
        </button>
      </div>

      <div className="max-h-[70vh] overflow-y-auto px-4 py-4">
        {dayEvents.length ? (
          <div className="space-y-4">
            {dayEvents.map((event, index) => (
              <div
                key={`${event.event_id || "draft"}-${event.start_time}-${index}`}
              >
                <CalendarSidebarItem
                  event={event}
                  onSave={handleSaveEvent}
                  onDelete={handleDeleteEvent}
                />
                {index < dayEvents.length - 1 && (
                  <div className="mt-4 border-t-2 border-slate-300" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
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
            className="rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-300"
          >
            {loading ? "Adding..." : "Add new event"}
          </button>
        </div>
      </div>
    </aside>
  );
};
