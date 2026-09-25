import type { Day } from "../../../api/services/calendar";
import { CalendarItem } from "./CalendarItem";

type CalendarMonthProps = {
  visibleDates: Date[];
  daysByMonth: Day[];
  currentMonth: Date;
};

const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarMonth({
  visibleDates,
  daysByMonth,
  currentMonth,
}: CalendarMonthProps) {
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gap: "8px",
          width: "100%",
          maxWidth: "760px",
        }}
      >
        {weekdayNames.map((weekday) => (
          <div key={weekday} style={{ textAlign: "center", fontWeight: 600 }}>
            {weekday}
          </div>
        ))}

        {visibleDates.map((date) => {
          const isoDate = date.toISOString().split("T")[0];
          const day = daysByMonth.find((d) => d.reference_date === isoDate);
          const isCurrentMonth =
            date.getFullYear() === currentMonth.getFullYear() &&
            date.getMonth() === currentMonth.getMonth();

          return (
            <CalendarItem
              key={`${isoDate}-${date.getHours()}`}
              day={day ?? null}
              date={isoDate}
              isCurrentMonth={isCurrentMonth}
            />
          );
        })}
      </div>
    </div>
  );
}
