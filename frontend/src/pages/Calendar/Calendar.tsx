import { useState } from "react";
import { addDays, addMonths, startOfMonth, startOfWeek } from "date-fns";
import { CalendarMonth } from "./components/CalendarMonth";
import { useGetEvents } from "./hooks/getEvents";
import { getCurrentUserIdFromStorage } from "../../context/getUserID";
import { getEventsInMonth } from "./getEventsInMonth";

export const Calendar = () => {
  const [monthOffset, setMonthOffset] = useState(0);
  const month = addMonths(new Date(), monthOffset);
  const monthStart = startOfMonth(month);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const visibleDates = Array.from({ length: 42 }, (_, index) =>
    addDays(calendarStart, index),
  );
  // const currentMonthKey = format(month, "yyyy-MM");
  const { events, loading, error } = useGetEvents(
    getCurrentUserIdFromStorage() ?? "",
  );

  const eventsInMonth = getEventsInMonth(month, events);

  if (loading) return <div>Loading</div>;
  if (error) return <div>Error: {error.message}</div>;

  const onPrevMonth = () => {
    setMonthOffset((prevOffset) => prevOffset - 1);
  };

  const onNextMonth = () => {
    setMonthOffset((prevOffset) => prevOffset + 1);
  };

  return (
    <div>
      <h1>Calendar</h1>
      <div>
        <div>
          <button onClick={onPrevMonth}>Prev</button>
          <h2 style={{ margin: "0 0 8px" }}>
            {month.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button onClick={onNextMonth}>Next</button>
        </div>
        <div>
          <CalendarMonth
            visibleDates={visibleDates}
            eventsInMonth={eventsInMonth}
            currentMonth={month}
          />
        </div>
      </div>
    </div>
  );
};
