import { EventType, QuickAlert } from "../types.js";

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
function generateEventId(quickAlert: QuickAlert): EventId {
  const { event, txHash, logIndex } = quickAlert;

  // For different event types, extract the relevant identifying data
  let uniqueData = "";

  switch (event.eventName) {
    // All proposal-related events have a proposalId
    case EventType.ProposalCreated:
    case EventType.ProposalQueued:
    case EventType.ProposalExecuted:
    case EventType.ProposalCanceled:
      uniqueData =
        "proposalId" in event.args ? event.args.proposalId.toString() : "";
      break;

    // TimelockChange event has an oldTimelock and a newTimelock
    case EventType.TimelockChange:
      if ("oldTimelock" in event.args && "newTimelock" in event.args) {
        uniqueData = `${event.args.oldTimelock}-${event.args.newTimelock}`;
      }
      break;

    // Health check event has a token and a value
    case EventType.MedianUpdated:
      if ("token" in event.args && "value" in event.args) {
        uniqueData = `${event.args.token}-${event.args.value.toString()}`;
      }
      break;

    // Use empty string for unknown event types
    default:
      uniqueData = "";
  }

  return `${event.eventName}-${uniqueData}-${txHash}-${String(
    quickAlert.blockNumber,
  )}-${String(logIndex)}`;
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
 * @param quickAlert The event to check
 * @returns true if the event is a duplicate, false otherwise
 */
export function isDuplicate(quickAlert: QuickAlert): boolean {
  const eventId = generateEventId(quickAlert);
  const now = Date.now();

  if (process.env.DEBUG) {
    console.log(
      `[DEDUP] Checking event: ${
        quickAlert.event.eventName
      } (logIndex: ${String(quickAlert.logIndex)}, txHash: ${
        quickAlert.txHash
      })`,
    );

    if (
      quickAlert.event.eventName === EventType.MedianUpdated &&
      "token" in quickAlert.event.args &&
      "value" in quickAlert.event.args
    ) {
      console.log(
        `[DEDUP] MedianUpdated details - token: ${
          quickAlert.event.args.token
        }, value: ${String(quickAlert.event.args.value)}`,
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
