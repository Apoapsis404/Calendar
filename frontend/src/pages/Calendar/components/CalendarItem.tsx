import type { CalendarEvent } from "../../../api/services/calendar";

type CalendarItemProps = {
  events: CalendarEvent[] | null;
  date: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  onSelectDate?: (date: string) => void;
};

export const CalendarItem = ({
  events,
  date,
  isCurrentMonth,
  isToday,
  onSelectDate,
}: CalendarItemProps) => {
  const [year, month, day] = date.split("-").map(Number);
  const dayNumber = new Date(year, month - 1, day).getDate();

  const cellClasses = [
    "h-full min-h-[88px] rounded-lg border border-slate-200 p-2 text-left transition-colors",
    isCurrentMonth ? "opacity-100" : "opacity-60",
    isToday ? "ring-2 ring-blue-500 ring-offset-1" : "",
    isCurrentMonth
      ? events?.length
        ? "bg-blue-50"
        : "bg-white hover:bg-slate-50"
      : "bg-slate-100 hover:bg-slate-200",
  ]
    .filter(Boolean)
    .join(" ");

  const dayClasses = [
    "m-0 font-semibold",
    isCurrentMonth ? "text-slate-900" : "text-slate-500",
  ].join(" ");

  return (
    <button
      type="button"
      onClick={() => onSelectDate?.(date)}
      className={cellClasses}
    >
      <p className={dayClasses}>{dayNumber}</p>
      {events?.slice(0, 3).map((event) => (
        <p
          key={`${event.event_id || "draft"}-${event.start_time}-${event.end_time}`}
          className="mt-1.5 truncate text-left text-xs font-medium text-slate-700"
        >
          {event.event_name || "New event"}
        </p>
      ))}
    </button>
  );
};
