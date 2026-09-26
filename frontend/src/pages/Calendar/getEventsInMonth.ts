import type { CalendarEvent } from "../../api/services/calendar";

const addDays = (date: Date, days: number): Date =>
  new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

const isEndOfMonth = (date: Date): boolean => {
  const nextMonth = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
  );
  return date.getUTCDate() === nextMonth.getUTCDate();
};

const addMonthsKeepingLastDay = (baseDate: Date, monthOffset: number): Date => {
  const targetYear = baseDate.getUTCFullYear();
  const targetMonthIndex = baseDate.getUTCMonth() + monthOffset;
  const lastDayOfTargetMonth = new Date(
    Date.UTC(targetYear, targetMonthIndex + 1, 0),
  ).getUTCDate();

  const day = isEndOfMonth(baseDate)
    ? lastDayOfTargetMonth
    : Math.min(baseDate.getUTCDate(), lastDayOfTargetMonth);

  return new Date(
    Date.UTC(
      targetYear,
      targetMonthIndex,
      day,
      baseDate.getUTCHours(),
      baseDate.getUTCMinutes(),
      baseDate.getUTCSeconds(),
      baseDate.getUTCMilliseconds(),
    ),
  );
};

const addYearsKeepingLastDay = (baseDate: Date, yearOffset: number): Date => {
  const targetYear = baseDate.getUTCFullYear() + yearOffset;
  const targetMonthIndex = baseDate.getUTCMonth();
  const lastDayOfTargetMonth = new Date(
    Date.UTC(targetYear, targetMonthIndex + 1, 0),
  ).getUTCDate();

  const day = isEndOfMonth(baseDate)
    ? lastDayOfTargetMonth
    : Math.min(baseDate.getUTCDate(), lastDayOfTargetMonth);

  return new Date(
    Date.UTC(
      targetYear,
      targetMonthIndex,
      day,
      baseDate.getUTCHours(),
      baseDate.getUTCMinutes(),
      baseDate.getUTCSeconds(),
      baseDate.getUTCMilliseconds(),
    ),
  );
};

const shiftEventTime = (
  event: CalendarEvent,
  occurrenceStart: Date,
): CalendarEvent => {
  const originalStart = new Date(event.start_time);
  const originalEnd = new Date(event.end_time);
  const durationMs = Math.max(
    0,
    originalEnd.getTime() - originalStart.getTime(),
  );

  return {
    ...event,
    start_time: occurrenceStart.toISOString(),
    end_time: new Date(occurrenceStart.getTime() + durationMs).toISOString(),
  };
};

const collectOccurrences = (
  event: CalendarEvent,
  monthStart: Date,
  monthEnd: Date,
): Date[] => {
  const baseStart = new Date(event.start_time);
  const occurrences: Date[] = [];

  if (event.recurring === "daily") {
    let occurrence = new Date(baseStart.getTime());
    while (occurrence < monthStart) {
      occurrence = addDays(occurrence, 1);
    }

    while (occurrence < monthEnd) {
      occurrences.push(new Date(occurrence));
      occurrence = addDays(occurrence, 1);
    }
  }

  if (event.recurring === "weekly") {
    let occurrence = new Date(baseStart.getTime());
    while (occurrence < monthStart) {
      occurrence = addDays(occurrence, 7);
    }

    while (occurrence < monthEnd) {
      occurrences.push(new Date(occurrence));
      occurrence = addDays(occurrence, 7);
    }
  }

  if (event.recurring === "monthly") {
    let step = 0;
    let occurrence = addMonthsKeepingLastDay(baseStart, step);

    while (occurrence < monthStart) {
      step += 1;
      occurrence = addMonthsKeepingLastDay(baseStart, step);
    }

    while (occurrence < monthEnd) {
      occurrences.push(new Date(occurrence));
      step += 1;
      occurrence = addMonthsKeepingLastDay(baseStart, step);
    }
  }

  if (event.recurring === "yearly") {
    let step = 0;
    let occurrence = addYearsKeepingLastDay(baseStart, step);

    while (occurrence < monthStart) {
      step += 1;
      occurrence = addYearsKeepingLastDay(baseStart, step);
    }

    while (occurrence < monthEnd) {
      occurrences.push(new Date(occurrence));
      step += 1;
      occurrence = addYearsKeepingLastDay(baseStart, step);
    }
  }

  if (
    event.recurring == null &&
    event.custom_recurring &&
    event.custom_recurring > 0
  ) {
    let occurrence = new Date(baseStart.getTime());
    while (occurrence < monthStart) {
      occurrence = addDays(occurrence, event.custom_recurring);
    }

    while (occurrence < monthEnd) {
      occurrences.push(new Date(occurrence));
      occurrence = addDays(occurrence, event.custom_recurring);
    }
  }

  return occurrences;
};

export const getEventsInMonth = (
  currentMonth: Date,
  allEvents: CalendarEvent[],
): CalendarEvent[] => {
  const monthStart = new Date(
    Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth(), 1),
  );
  const monthEnd = new Date(
    Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth() + 1, 1),
  );

  const inMonthEvents: CalendarEvent[] = [];

  for (const event of allEvents) {
    if (!event || !event.start_time) {
      continue;
    }

    const baseStart = new Date(event.start_time);
    if (Number.isNaN(baseStart.getTime())) {
      continue;
    }

    const recurringRule = event.recurring;
    const hasCustomRecurrence =
      event.recurring == null &&
      typeof event.custom_recurring === "number" &&
      event.custom_recurring > 0;

    if (!recurringRule && !hasCustomRecurrence) {
      if (baseStart >= monthStart && baseStart < monthEnd) {
        inMonthEvents.push({ ...event });
      }
      continue;
    }

    const occurrences = collectOccurrences(event, monthStart, monthEnd);

    for (const occurrence of occurrences) {
      inMonthEvents.push(shiftEventTime(event, occurrence));
    }
  }

  return inMonthEvents.sort(
    (left, right) =>
      new Date(left.start_time).getTime() -
      new Date(right.start_time).getTime(),
  );
};
