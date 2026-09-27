import { useEffect, useState } from "react";
import { addDays, addMonths, startOfMonth, startOfWeek } from "date-fns";
import { CalendarMonth } from "./components/CalendarMonth";
import { useGetEvents } from "./hooks/getEvents";
import { getCurrentUserIdFromStorage } from "../../context/getUserID";
import { getEventsInMonth } from "./getEventsInMonth";
import { CalendarHeader } from "./components/CalendarHeader";
import { CalendarSidebar } from "./components/sidebar/CalendarSidebar";
import { formatLocalDateKey } from "./formatLocalDateKey";
import type { CalendarEvent } from "../../api/services/calendar";

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
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(events);

  useEffect(() => {
    setCalendarEvents(events);
  }, [events]);

  const eventsInMonth = getEventsInMonth(month, calendarEvents);

  if (loading) return <div>Loading</div>;
  if (error) return <div>Error: {error.message}</div>;

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
    <div className="flex gap-6">
      <div className="flex-1">
        <h1>Calendar</h1>
        <div>
          <CalendarHeader
            currentMonth={month}
            onNextMonth={onNextMonth}
            onPrevMonth={onPrevMonth}
          />
          <div>
            <CalendarMonth
              visibleDates={visibleDates}
              eventsInMonth={eventsInMonth}
              currentMonth={month}
              onSelectDate={changeSelectedDate}
            />
          </div>
        </div>
      </div>

      <CalendarSidebar
        isOpen={isSidebarOpen}
        selectedDate={selectedDate}
        events={calendarEvents}
        onClose={() => setIsSidebarOpen(false)}
        onDateChange={(nextDate) => {
          setSelectedDate(nextDate);
          setIsSidebarOpen(true);
        }}
        onEventsChange={setCalendarEvents}
      />
    </div>
  );
};
