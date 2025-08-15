import assert from "assert";
import { EventType, QuickAlert } from "../types";

// CELO/cUSD rate feed address - only log health checks for this feed
const CELO_CUSD_RATE_FEED_ADDRESS =
  "0x765de816845861e75a25fca122bb6898b8b1282a".toLowerCase();

export default function handleHealthCheckEvent(quickAlert: QuickAlert) {
  assert(
    quickAlert.blockNumber,
    "Block number is missing from MedianUpdated health check event",
  );

  // Only log health check for cUSD token
  if (
    quickAlert.event.eventName === EventType.MedianUpdated &&
    "token" in quickAlert.event.args
  ) {
    const tokenAddress = quickAlert.event.args.token.toLowerCase();

    if (tokenAddress === CELO_CUSD_RATE_FEED_ADDRESS) {
      console.info("[HealthCheck]: Block", quickAlert.blockNumber);
    }
    // Silently ignore health checks for other tokens
  }
}
