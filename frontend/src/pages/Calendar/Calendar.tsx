import { useEffect, useState } from "react";
import { getDays } from "../../api/services/calendar";
import { addMonths } from "date-fns";
import { CalendarMonth } from "./components/CalendarMonth";
import { getDatesForMonthFromLocalStorage } from "./hooks/getDays";

export const Calendar = () => {
  const [monthOffset, setMonthOffset] = useState(0);
  const month = addMonths(new Date(), monthOffset);
  const visibleDates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(month.getFullYear(), month.getMonth(), i + 1);
    return date;
  });

  useEffect(() => {
    try {
      console.log("Hello");
      getDays();
    } catch (err) {
      console.error("Error fetching days:", err);
    }
  }, []);

  return (
    <div>
      <h1>Calendar</h1>
      <CalendarMonth
        visibleDates={visibleDates}
        daysByMonth={getDatesForMonthFromLocalStorage(
          month.toISOString().slice(0, 7),
        )}
      />
    </div>
  );
};
