import type { Day } from "../../../api/services/calendar";

type CalendarItemProps = {
  day: Day | null;
  date: string;
  isCurrentMonth: boolean;
};

export const CalendarItem = ({
  day,
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
          ? day
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
      {day && <p style={{ margin: "6px 0 0" }}>Hello</p>}
    </div>
  );
};
