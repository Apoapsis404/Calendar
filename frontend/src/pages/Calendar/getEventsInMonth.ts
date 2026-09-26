import type { CalendarEvent } from "../../api/services/calendar";

const parseEventDate = (value: string): Date | null => {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const withoutDuplicateOffset = trimmed.replace(
    /([+-]\d{2})(\d{2})\s+([+-]\d{2})(\d{2})$/,
    "$1$2",
  );
  const withoutUtcText = withoutDuplicateOffset.replace(/\s+UTC$/i, "");
  const withNormalizedOffset = withoutUtcText.replace(
    /\s+([+-])(\d{2})(\d{2})$/,
    " $1$2:$3",
  );

  const isoCandidate = withNormalizedOffset.includes("T")
    ? withNormalizedOffset
    : withNormalizedOffset.replace(
        /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})(?:\s+([+-]\d{2}:\d{2}))?$/,
        "$1T$2$3",
      );

  const finalCandidate = /[Zz]|[+-]\d{2}:\d{2}$/.test(isoCandidate)
    ? isoCandidate
    : `${isoCandidate}Z`;

  const parsed = new Date(finalCandidate);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

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
  const originalStart = parseEventDate(event.start_time);
  const originalEnd = parseEventDate(event.end_time);
  const durationMs =
    originalStart && originalEnd
      ? Math.max(0, originalEnd.getTime() - originalStart.getTime())
      : 0;

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
  const baseStart = parseEventDate(event.start_time);
  const occurrences: Date[] = [];

  if (!baseStart) {
    return occurrences;
  }

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

    const baseStart = parseEventDate(event.start_time);
    if (!baseStart) {
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
