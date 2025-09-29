import { eventRegistry } from ".";
import { EventType, QuicknodeEvent } from "../types";

/**
 * Process an event using the registry
 */
export async function processEvent(event: QuicknodeEvent): Promise<void> {
  // Handle special cases first
  if (event.name === EventType.MedianUpdated) {
    const healthCheckHandler = eventRegistry.getSpecialHandler("healthCheck");
    if (healthCheckHandler) {
      void healthCheckHandler(event);
      return;
    }
  }

  // Handle regular events
  const handler = eventRegistry.getHandler(event.name);
  if (handler) {
    await handler(event);
  } else {
    console.warn(`No handler registered for event type: ${event.name}`);
  }
}
