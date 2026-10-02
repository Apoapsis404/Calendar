import type { CalendarEvent } from "../../api/services/calendar";
import { CalendarSidebarItem } from "../Calendar/components/sidebar/CalendarSidebarItem";

export const Home = () => {
  const event: CalendarEvent = {
    event_id: "41e8354a-1968-4b3e-98f9-08748ef762c4",
    created_at: "2026-09-26 13:06:22.680852 +0000 +0000",
    updated_at: "2026-09-26 13:06:22.680852 +0000 +0000",
    event_name: "test event",
    description: "test description",
    recurring: null,
    custom_recurring: 0,
    start_time: "2026-09-25 12:00:00 +0000 +0000",
    end_time: "2026-09-25 15:00:00 +0000 +0000",
  };
  const event2: CalendarEvent = {
    event_id: "41e8354a-1968-4b3e-98f9-08748ef762c3",
    created_at: "2026-09-26 13:06:22.680852 +0000 +0000",
    updated_at: "2026-09-26 13:06:22.680852 +0000 +0000",
    event_name: "test event2",
    description: "test description2",
    recurring: null,
    custom_recurring: 0,
    start_time: "2026-09-25 16:00:00 +0000 +0000",
    end_time: "2026-09-25 18:00:00 +0000 +0000",
  };

  return (
    <div className="space-y-6 rounded-[28px] border border-(--color-border) bg-white/80 p-6 shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--color-accent)">
          Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-(--color-text-h)">
          Home
        </h1>
      </div>

      <div className="space-y-4">
        <CalendarSidebarItem event={event} onSave={() => undefined} />
        <CalendarSidebarItem event={event2} onSave={() => undefined} />
      </div>
    </div>
  );
};
