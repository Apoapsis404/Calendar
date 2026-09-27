type CalendarHeaderProps = {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

export function CalendarHeader({
  currentMonth,
  onPrevMonth,
  onNextMonth,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center gap-3 justify-center">
      <button onClick={onPrevMonth}>Prev</button>
      <h2 style={{ margin: "0 0 8px" }}>
        {currentMonth.toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </h2>
      <button onClick={onNextMonth}>Next</button>
    </div>
  );
}
