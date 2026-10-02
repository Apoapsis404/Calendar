import { useState } from "react";
import { addDays, addMonths, startOfMonth, startOfWeek } from "date-fns";
import { CalendarMonth } from "./components/CalendarMonth";
import { useGetEvents } from "./hooks/getEvents";
import { getCurrentUserIdFromStorage } from "../../context/getUserID";
import { getEventsInMonth } from "./getEventsInMonth";
import { CalendarHeader } from "./components/CalendarHeader";
import { CalendarSidebar } from "./components/sidebar/CalendarSidebar";
import { formatLocalDateKey } from "./formatLocalDateKey";

export const Calendar = () => {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(
    formatLocalDateKey(new Date()),
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const month = addMonths(new Date(), monthOffset);
  const monthStart = startOfMonth(month);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const visibleDates = Array.from({ length: 42 }, (_, index) =>
    addDays(calendarStart, index),
  );
  const { events, loading, error } = useGetEvents(
    getCurrentUserIdFromStorage() ?? "",
  );

  const eventsInMonth = getEventsInMonth(month, events);

  if (loading)
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-white/80 p-6 text-[var(--color-text)] shadow-sm">
        Loading
      </div>
    );
  if (error)
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
        Error: {error.message}
      </div>
    );

  const onPrevMonth = () => {
    setMonthOffset((prevOffset) => prevOffset - 1);
  };

  const onNextMonth = () => {
    setMonthOffset((prevOffset) => prevOffset + 1);
  };

  const changeSelectedDate = (nextDate: string) => {
    setSelectedDate(nextDate);
    setIsSidebarOpen(true);
  };

  return (
    <div className="flex w-full items-stretch gap-(--page-content-gap)">
      <div className="min-w-0 flex-1 rounded-[28px] border border-(--color-border) bg-red/80 p-4 shadow-[0_20px_45px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--color-accent)">
              Schedule
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-(--color-text-h) sm:text-4xl">
              Calendar
            </h1>
          </div>
        </div>

        <CalendarHeader
          currentMonth={month}
          onNextMonth={onNextMonth}
          onPrevMonth={onPrevMonth}
        />

        <div className="mt-4 overflow-hidden rounded-2xl border border-(--color-border) bg-white p-3">
          <CalendarMonth
            visibleDates={visibleDates}
            eventsInMonth={eventsInMonth}
            currentMonth={month}
            onSelectDate={changeSelectedDate}
          />
        </div>
      </div>

      <CalendarSidebar
        isOpen={isSidebarOpen}
        selectedDate={selectedDate}
        events={events}
        onClose={() => setIsSidebarOpen(false)}
        onDateChange={(nextDate) => {
          setSelectedDate(nextDate);
          setIsSidebarOpen(true);
        }}
        onEventsChange={() => {
          // derived from the latest server state; no local mirror needed
        }}
      />
    </div>
  );
};
