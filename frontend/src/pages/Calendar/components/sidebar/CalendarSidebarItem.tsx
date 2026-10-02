import { useState } from "react";
import type { CalendarEvent } from "../../../../api/services/calendar";

type CalendarSidebarItemProps = {
  event: CalendarEvent;
  onSave: (event: CalendarEvent) => Promise<void> | void;
  onDelete?: (eventId: string) => void;
};

const toDatetimeLocalValue = (value: string): string => {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const isoMatch = trimmed.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/);
  if (isoMatch) {
    return `${isoMatch[1]}T${isoMatch[2]}`;
  }

  const spacedMatch = trimmed.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}):(\d{2})/);
  if (spacedMatch) {
    return `${spacedMatch[1]}T${spacedMatch[2]}:${spacedMatch[3]}`;
  }

  return "";
};

const toStoredDateTime = (value: string): string => {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed.includes("T")) {
    const [datePart, timePart] = trimmed.split("T");
    if (!datePart || !timePart) {
      return trimmed;
    }

    const timeWithoutZone = timePart
      .replace(/Z$/, "")
      .replace(/\+\d{2}:?\d{2}$/, "");
    return `${datePart}T${timeWithoutZone}`;
  }

  const spacedMatch = trimmed.match(
    /^(\d{4}-\d{2}-\d{2})\s+(\d{2}):(\d{2})(?::(\d{2}))?/,
  );
  if (spacedMatch) {
    return `${spacedMatch[1]}T${spacedMatch[2]}:${spacedMatch[3]}${spacedMatch[4] ? `:${spacedMatch[4]}` : ":00"}`;
  }

  return trimmed;
};

const formatReadableDateTime = (value: string): string => {
  if (!value) {
    return "No date";
  }

  const candidate = value.includes("T") ? value : value.replace(" ", "T");
  const date = new Date(candidate);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

export const CalendarSidebarItem = ({
  event,
  onSave,
  onDelete,
}: CalendarSidebarItemProps) => {
  const [draft, setDraft] = useState<CalendarEvent>(event);
  const [isEditing, setIsEditing] = useState(!event.event_id);

  const handleSave = async () => {
    const updatedEvent: CalendarEvent = {
      ...draft,
      event_name: draft.event_name.trim() || "New event",
      description: draft.description || "",
      start_time: toStoredDateTime(draft.start_time),
      end_time: toStoredDateTime(draft.end_time),
      updated_at: new Date().toISOString(),
    };

    await onSave(updatedEvent);
    setIsEditing(false);
  };

  const handleFieldChange = (
    field: "event_name" | "description" | "start_time" | "end_time",
    value: string,
  ) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-(--color-border) bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)] ring-1 ring-black/5">
      <header className="flex items-center justify-between gap-3 border-b border-(--color-border) bg-(--color-accent-bg) px-3 py-2">
        {isEditing ? (
          <input
            value={draft.event_name ?? ""}
            onChange={(eventTarget) =>
              handleFieldChange("event_name", eventTarget.target.value)
            }
            placeholder="Event name"
            className="flex-1 rounded-lg border border-(--color-border) bg-white px-2 py-1.5 text-center text-base font-semibold text-(--color-text-h) outline-none ring-0"
            aria-label="Event name"
          />
        ) : (
          <h3 className="flex-1 text-center text-lg font-semibold text-(--color-text-h)">
            {event.event_name || "New event"}
          </h3>
        )}

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => void handleSave()}
                className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-emerald-700"
              >
                Confirm
              </button>
              {!event.event_id && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-md border border-(--color-border) bg-white px-2.5 py-1 text-xs font-medium text-(--color-text-h) transition hover:bg-slate-100"
                >
                  Cancel
                </button>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-md border border-(--color-border) bg-white px-2.5 py-1 text-xs font-medium text-(--color-text-h) transition hover:bg-slate-100"
              >
                Edit
              </button>
              {event.event_id && onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(event.event_id)}
                  className="rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 transition hover:bg-red-100"
                >
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      </header>

      <div className="space-y-3 p-3 text-sm text-(--color-text)">
        {isEditing ? (
          <>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-(--color-text)">
                Description
              </span>
              <textarea
                rows={2}
                value={draft.description ?? ""}
                onChange={(eventTarget) =>
                  handleFieldChange("description", eventTarget.target.value)
                }
                className="w-full rounded-lg border border-(--color-border) bg-white px-2.5 py-2 text-sm text-(--color-text-h) outline-none"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-(--color-text)">
                  Start
                </span>
                <input
                  type="datetime-local"
                  value={toDatetimeLocalValue(draft.start_time)}
                  onChange={(eventTarget) =>
                    handleFieldChange("start_time", eventTarget.target.value)
                  }
                  className="w-full rounded-lg border border-(--color-border) bg-white px-2.5 py-2 text-sm text-(--color-text-h) outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-(--color-text)">
                  End
                </span>
                <input
                  type="datetime-local"
                  value={toDatetimeLocalValue(draft.end_time)}
                  onChange={(eventTarget) =>
                    handleFieldChange("end_time", eventTarget.target.value)
                  }
                  className="w-full rounded-lg border border-(--color-border) bg-white px-2.5 py-2 text-sm text-(--color-text-h) outline-none"
                />
              </label>
            </div>
          </>
        ) : (
          <>
            <p className="rounded-lg bg-slate-50 px-2.5 py-2 text-(--color-text)">
              {event.description || "No description"}
            </p>
            <p>
              <strong className="text-(--color-text-h)">Start:</strong>{" "}
              {formatReadableDateTime(event.start_time)}
            </p>
            <p>
              <strong className="text-(--color-text-h)">End:</strong>{" "}
              {formatReadableDateTime(event.end_time)}
            </p>
          </>
        )}
      </div>
    </article>
  );
};
