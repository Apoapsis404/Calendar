import type { CalendarEvent } from "../../../api/services/calendar";

type CalendarItemProps = {
  events: CalendarEvent[] | null;
  date: string;
  isCurrentMonth: boolean;
};

export const CalendarItem = ({
  events,
  date,
  isCurrentMonth,
}: CalendarItemProps) => {
  const dayNumber = new Date(`${date}T12:00:00`).getDate();

  return (
    <div
      style={{
        minHeight: "90px",
        border: "1px solid #d5d5d5",
        borderRadius: "8px",
        padding: "8px",
        backgroundColor: isCurrentMonth
          ? events?.length
            ? "#f3f8ff"
            : "#fff"
          : "#f1f1f1",
        opacity: isCurrentMonth ? 1 : 0.6,
      }}
    >
      <p
        style={{
          margin: 0,
          fontWeight: 600,
          color: isCurrentMonth ? "#111" : "#7a7a7a",
        }}
      >
        {dayNumber}
      </p>
      {events?.slice(0, 3).map((event) => (
        <p
          key={`${event.event_id}-${event.start_time}`}
          style={{ margin: "6px 0 0" }}
        >
          {event.event_name}
        </p>
      ))}
    </div>
  );
};
