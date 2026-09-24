import type { Day } from "../../../api/services/calendar";

type CalendarItemProps = {
  day: Day | null;
  date: string;
};

export const CalendarItem = ({ day, date }: CalendarItemProps) => {
  return (
    <div>
      <p>{date}</p>
      {day && <p>Hello</p>}
    </div>
  );
};
