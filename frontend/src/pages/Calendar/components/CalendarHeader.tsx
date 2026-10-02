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
    <div className="flex items-center justify-center gap-3">
      <button onClick={onPrevMonth}>Prev</button>
      <h2 className="mb-2 text-[var(--color-text-h)]">
        {currentMonth.toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </h2>
      <button onClick={onNextMonth}>Next</button>
    </div>
  );
}
