import type { CalendarEvent } from "../../../api/services/calendar";
import { CalendarItem } from "./CalendarItem";

type CalendarMonthProps = {
  visibleDates: Date[];
  eventsInMonth: CalendarEvent[];
  currentMonth: Date;
};

const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarMonth({
  visibleDates,
  eventsInMonth,
  currentMonth,
}: CalendarMonthProps) {
  return (
    <div>
      <div>
        <h2 style={{ margin: "0 0 8px" }}>
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
      </div>
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
          const events = eventsInMonth.filter(
            (event) => event.start_time.slice(0, 10) === isoDate,
          );
          const isCurrentMonth =
            date.getFullYear() === currentMonth.getFullYear() &&
            date.getMonth() === currentMonth.getMonth();

          return (
            <CalendarItem
              key={`${isoDate}-${date.getHours()}`}
              events={events.length ? events : null}
              date={isoDate}
              isCurrentMonth={isCurrentMonth}
            />
          );
        })}
      </div>
    </div>
  );
}
