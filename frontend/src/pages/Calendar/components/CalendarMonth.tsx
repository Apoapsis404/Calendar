import type { CalendarEvent } from "../../../api/services/calendar";
import { formatLocalDateKey } from "../formatLocalDateKey";
import { CalendarItem } from "./CalendarItem";

type CalendarMonthProps = {
  visibleDates: Date[];
  eventsInMonth: CalendarEvent[];
  currentMonth: Date;
  onSelectDate?: (date: string) => void;
};

const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarMonth({
  visibleDates,
  eventsInMonth,
  currentMonth,
  onSelectDate,
}: CalendarMonthProps) {
  const todayKey = formatLocalDateKey(new Date());

  return (
    <div>
      <div
        className="grid w-full grid-cols-7 gap-2"
        style={{
          gridTemplateRows: "repeat(6, minmax(0, 1fr))",
          gridAutoRows: "minmax(88px, 1fr)",
        }}
      >
        {weekdayNames.map((weekday) => (
          <div key={weekday} className="text-center font-bold">
            {weekday}
          </div>
        ))}

        {visibleDates.map((date) => {
          const isoDate = formatLocalDateKey(date);
          const events = eventsInMonth.filter(
            (event) => event.start_time.slice(0, 10) === isoDate,
          );
          const isCurrentMonth =
            date.getFullYear() === currentMonth.getFullYear() &&
            date.getMonth() === currentMonth.getMonth();
          const isToday = isoDate === todayKey;

          return (
            <CalendarItem
              key={`${isoDate}-${date.getHours()}`}
              events={events.length ? events : null}
              date={isoDate}
              isCurrentMonth={isCurrentMonth}
              isToday={isToday}
              onSelectDate={onSelectDate}
            />
          );
        })}
      </div>
    </div>
  );
}
