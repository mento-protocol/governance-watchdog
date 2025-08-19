import assert from "assert";
import { EventType, QuicknodeWebhook } from "../types";

// CELO/cUSD rate feed address - only log health checks for this feed
const CELO_CUSD_RATE_FEED_ADDRESS =
  "0x765de816845861e75a25fca122bb6898b8b1282a".toLowerCase();

export default function handleHealthCheckEvent(webhook: QuicknodeWebhook) {
  assert(
    webhook.blockNumber,
    "Block number is missing from MedianUpdated health check event",
  );

  // Only log health check for cUSD token
  if (
    webhook.event.eventName === EventType.MedianUpdated &&
    "token" in webhook.event.args
  ) {
    const tokenAddress = webhook.event.args.token.toLowerCase();

    if (tokenAddress === CELO_CUSD_RATE_FEED_ADDRESS) {
      console.info("[HealthCheck]: Block", webhook.blockNumber);
    }
    // Silently ignore health checks for other tokens
  }
}
