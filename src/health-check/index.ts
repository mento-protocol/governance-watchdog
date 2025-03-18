import assert from "assert";
import { QuickAlert } from "../types";

export default function handleHealthCheckEvent(quickAlert: QuickAlert) {
  assert(
    quickAlert.blockNumber,
    "Block number is missing from MedianUpdated health check event",
  );
  console.info("[HealthCheck]: Block", quickAlert.blockNumber);
}
