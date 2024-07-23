import type { DecodeEventLogReturnType } from "viem";
import type SortedOraclesABI from "../sorted-oracles-abi.js";
import type { HealthCheckEvent } from "../types.js";

export default function isHealthCheckEvent(
  event: DecodeEventLogReturnType<typeof SortedOraclesABI> | null | undefined,
): event is HealthCheckEvent {
  if (
    event === null ||
    event === undefined ||
    typeof event !== "object" ||
    !("args" in event)
  ) {
    return false;
  }
  return (
    event.eventName === "MedianUpdated" &&
    "token" in event.args &&
    "value" in event.args
  );
}
