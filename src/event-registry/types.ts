import type { EventType, QuicknodeEvent } from "../types.js";
import type { EventHandlerConfig } from "../utils/event-handler.js";

/**
 * Extended event configuration that includes metadata for routing and processing
 */
export interface ExtendedEventHandlerConfig<T extends QuicknodeEvent>
  extends EventHandlerConfig<T> {
  // Deduplication strategy for this event type
  deduplicationStrategy:
    | "proposalId"
    | "tokenValue"
    | "transactionHash"
    | "custom";

  // Custom deduplication function if strategy is 'custom'
  customDeduplicationKey?: (event: T) => string;

  // Special processing flags
  requiresTimelockCalculation?: boolean;
  isHealthCheck?: boolean;

  // Processing priority (higher numbers processed first)
  priority?: number;
}

/**
 * Event handler function type
 */
export type EventHandlerFunction = (
  event: QuicknodeEvent,
) => Promise<void> | void;

/**
 * Registry entry for an event handler
 */
export interface EventRegistryEntry {
  eventType: EventType;
  handler: EventHandlerFunction;
  config: ExtendedEventHandlerConfig<QuicknodeEvent>;
}
