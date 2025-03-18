import assert from "assert";
import { ParsedQuickAlert } from "../types";

export default function handleHealthCheckEvent(quickAlert: ParsedQuickAlert) {
  assert(
    quickAlert.blockNumber,
    "Block number is missing from MedianUpdated health check event",
  );
  console.info("[HealthCheck]: Block", quickAlert.blockNumber);
}
