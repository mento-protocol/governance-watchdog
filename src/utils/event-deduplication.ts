import { EventType, QuicknodeEvent } from "../types.js";

type EventId = string;
type Timestamp = number;

// Map to store recently processed events in memory
const processedEvents = new Map<EventId, Timestamp>();

// Window of time in which to consider an event as a duplicate
const DEDUPLICATION_WINDOW_MS = 60 * 1000; // 1 minute

// Maximum number of events to keep in cache before cleanup
const MAX_CACHE_SIZE = 100;

/**
 * Generates a unique ID for an event based on its properties
 */
function generateEventId(event: QuicknodeEvent): EventId {
  // For different event types, extract the relevant identifying data
  let uniqueData = "";

  switch (event.name) {
    // All proposal-related events have a proposalId
    case EventType.ProposalCreated:
    case EventType.ProposalQueued:
    case EventType.ProposalExecuted:
    case EventType.ProposalCanceled:
      uniqueData = "proposalId" in event ? event.proposalId.toString() : "";
      break;

    // Health check event has a token and a value
    case EventType.MedianUpdated:
      if ("token" in event && "value" in event) {
        uniqueData = `${event.token}-${event.value.toString()}`;
      }
      break;

    // Use empty string for unknown event types
    default:
      uniqueData = "";
  }

  return `${event.name}-${uniqueData}-${event.transactionHash}-${event.blockNumber}-${event.logIndex}`;
}

/**
 * Removes old entries from the cache to prevent possible memory leaks.
 * Given the nature of Cloud Functions shutting down after a period of inactivity,
 * it's unlikely for this cache to grow too large, but still good practice to clean it up.
 */
function cleanupOldEntries(): void {
  const expiredTime = Date.now() - DEDUPLICATION_WINDOW_MS;

  for (const [id, timestamp] of processedEvents.entries()) {
    if (timestamp < expiredTime) {
      processedEvents.delete(id);
    }
  }
}

/**
 * Checks if an event is a duplicate (meaning: the same EventID has been processed recently)
 * @param event The event to check
 * @returns true if the event is a duplicate, false otherwise
 */
export function isDuplicate(event: QuicknodeEvent): boolean {
  const eventId = generateEventId(event);
  const now = Date.now();

  if (process.env.DEBUG) {
    console.log(
      `[DEDUP] Checking event: ${event.name} (logIndex: ${event.logIndex}, txHash: ${event.transactionHash})`,
    );

    if (
      event.name === EventType.MedianUpdated &&
      "token" in event &&
      "value" in event
    ) {
      console.log(
        `[DEDUP] MedianUpdated details - token: ${event.token},
         value: ${String(event.value)}`,
      );
    }
    console.log(`[DEDUP] Generated eventId: ${eventId}`);
  }

  // Check if we've seen this event recently
  if (processedEvents.has(eventId)) {
    const lastSeen = processedEvents.get(eventId) ?? 0;
    if (now - lastSeen < DEDUPLICATION_WINDOW_MS) {
      console.log(`[DEDUP] Duplicate event detected: ${eventId}`);
      return true; // It's a duplicate within our window
    }
  }

  // Update the cache
  processedEvents.set(eventId, now);

  if (process.env.DEBUG) {
    console.log(`[DEDUP] New event added to cache: ${eventId}`);
  }

  // Clean up old entries if cache is getting too large
  if (processedEvents.size > MAX_CACHE_SIZE) {
    cleanupOldEntries();
  }

  return false;
}

/**
 * For debugging/monitoring: get current size of deduplication cache
 */
export function getCacheSize(): number {
  return processedEvents.size;
}
