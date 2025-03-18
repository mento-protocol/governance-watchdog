import { EventType, TimelockChangeEvent } from "../types";

export default function isTimelockChangeEvent(
  event: unknown,
): event is TimelockChangeEvent {
  return (
    typeof event === "object" &&
    event !== null &&
    "eventName" in event &&
    event.eventName === EventType.TimelockChange &&
    "args" in event &&
    typeof event.args === "object" &&
    event.args !== null &&
    "oldTimelock" in event.args &&
    "newTimelock" in event.args
  );
}
