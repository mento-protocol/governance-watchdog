import { CallScheduledEvent, EventType } from "../types";

export default function isCallScheduledEvent(
  event: unknown,
): event is CallScheduledEvent {
  return (
    typeof event === "object" &&
    event !== null &&
    "eventName" in event &&
    event.eventName === EventType.CallScheduled &&
    "args" in event &&
    typeof event.args === "object" &&
    event.args !== null &&
    "id" in event.args &&
    "index" in event.args &&
    "target" in event.args &&
    "value" in event.args &&
    "data" in event.args &&
    "predecessor" in event.args &&
    "delay" in event.args
  );
}
