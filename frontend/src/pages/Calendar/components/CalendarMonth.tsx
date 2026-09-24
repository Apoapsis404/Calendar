import type { Day } from "../../../api/services/calendar";
import { CalendarItem } from "./CalendarItem";

type CalendarMonthProps = {
  visibleDates: Date[];
  daysByMonth: Day[];
};

export function CalendarMonth({
  visibleDates,
  daysByMonth,
}: CalendarMonthProps) {
  return (
    <div>
      {visibleDates.map((date) => {
        const day = daysByMonth.find(
          (d) => d.reference_date === date.toISOString().split("T")[0],
        );

        return (
          <CalendarItem
            key={date.toISOString()}
            day={day ?? null}
            date={date.toDateString()}
          />
        );
      })}
    </div>
  );
}
