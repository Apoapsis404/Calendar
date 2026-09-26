import type { CalendarEvent } from "../../../api/services/calendar";

type CalendarItemProps = {
  events: CalendarEvent[] | null;
  date: string;
  isCurrentMonth: boolean;
  isToday: boolean;
};

export const CalendarItem = ({
  events,
  date,
  isCurrentMonth,
  isToday,
}: CalendarItemProps) => {
  const [year, month, day] = date.split("-").map(Number);
  const dayNumber = new Date(year, month - 1, day).getDate();

  const cellClasses = [
    "h-full min-h-[88px] rounded-lg border border-slate-200 p-2",
    isCurrentMonth ? "opacity-100" : "opacity-60",
    isToday ? "ring-2 ring-blue-500 ring-offset-1" : "",
    isCurrentMonth
      ? events?.length
        ? "bg-blue-50"
        : "bg-white"
      : "bg-slate-100",
  ]
    .filter(Boolean)
    .join(" ");

  const dayClasses = [
    "m-0 font-semibold",
    isCurrentMonth ? "text-slate-900" : "text-slate-500",
  ].join(" ");

  return (
    <div className={cellClasses}>
      <p className={dayClasses}>{dayNumber}</p>
      {events?.slice(0, 3).map((event) => (
        <p key={`${event.event_id}-${event.start_time}`} className="mt-1.5">
          {event.event_name}
        </p>
      ))}
    </div>
  );
};
