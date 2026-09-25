import { useEffect, useState } from "react";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { CalendarMonth } from "./components/CalendarMonth";
import { getCurrentUserIdFromStorage, useGetDays } from "./hooks/getDays";

export const Calendar = () => {
  const [monthOffset] = useState(-1);
  const month = addMonths(new Date(), monthOffset);
  const monthStart = startOfMonth(month);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const visibleDates = Array.from({ length: 42 }, (_, index) =>
    addDays(calendarStart, index),
  );
  // const currentMonthKey = format(month, "yyyy-MM");
  const { days, loading, error } = useGetDays(getCurrentUserIdFromStorage());

  if (loading) return <div>Loading</div>;
  if (error) return <div>Error: {error.message}</div>;

  // useEffect(() => {
  //   const userId = getCurrentUserIdFromStorage();

  //   if (!userId) {
  //     return;
  //   }

  //   const loadDays = async () => {
  //     try {
  //       const days = await getDays();
  //       saveDatesToLocalStorage(days, userId);
  //     } catch (err) {
  //       console.error("Error fetching days:", err);
  //     }
  //   };

  //   void loadDays();
  // }, []);

  return (
    <div>
      <h1>Calendar</h1>
      <CalendarMonth
        visibleDates={visibleDates}
        daysByMonth={days}
        currentMonth={month}
      />
    </div>
  );
};
