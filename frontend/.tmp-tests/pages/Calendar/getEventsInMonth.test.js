import assert from "node:assert/strict";
import { getEventsInMonth } from "./getEventsInMonth";
const makeEvent = (overrides) => ({
    event_id: "event-1",
    user_id: "user-1",
    event_name: "Test event",
    description: "",
    recurring: null,
    custom_recurring: null,
    start_time: "2026-09-01T09:00:00Z",
    end_time: "2026-09-01T10:00:00Z",
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-09-01T00:00:00Z",
    ...overrides,
});
describe("getEventsInMonth", () => {
    it("expands weekly recurring events into each calendar week within the month", () => {
        const month = new Date("2026-09-01T00:00:00Z");
        const weekly = makeEvent({
            event_id: "weekly-1",
            event_name: "Band practice",
            recurring: "weekly",
            start_time: "2026-09-01T18:00:00Z",
            end_time: "2026-09-01T19:30:00Z",
        });
        const events = getEventsInMonth(month, [weekly]);
        assert.deepEqual(events.map((event) => event.start_time.slice(0, 10)), [
            "2026-09-01",
            "2026-09-08",
            "2026-09-15",
            "2026-09-22",
            "2026-09-29",
        ]);
    });
    it("keeps monthly events on the last valid day when the month is shorter", () => {
        const month = new Date("2026-10-01T00:00:00Z");
        const monthly = makeEvent({
            event_id: "monthly-1",
            recurring: "monthly",
            start_time: "2026-09-30T18:00:00Z",
            end_time: "2026-09-30T19:00:00Z",
        });
        const events = getEventsInMonth(month, [monthly]);
        assert.deepEqual(events.map((event) => event.start_time.slice(0, 10)), [
            "2026-10-31",
        ]);
    });
    it("supports day-based custom recurrence when there is no standard recurrence", () => {
        const month = new Date("2026-09-01T00:00:00Z");
        const custom = makeEvent({
            event_id: "custom-1",
            recurring: null,
            custom_recurring: 7,
            start_time: "2026-09-01T09:00:00Z",
            end_time: "2026-09-01T10:00:00Z",
        });
        const events = getEventsInMonth(month, [custom]);
        assert.deepEqual(events.map((event) => event.start_time.slice(0, 10)), [
            "2026-09-01",
            "2026-09-08",
            "2026-09-15",
            "2026-09-22",
            "2026-09-29",
        ]);
    });
});
