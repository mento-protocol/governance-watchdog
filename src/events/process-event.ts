import { eventRegistry } from "./registry";
import { EventType, QuicknodeEvent } from "./types.js";

/**
 * Process an event using the registry
 */
export async function processEvent(event: QuicknodeEvent): Promise<void> {
  // Handle special cases first
  if (event.name === EventType.MedianUpdated) {
    const healthCheckHandler = eventRegistry.getSpecialHandler("healthCheck");
    if (healthCheckHandler) {
      if (process.env.DEBUG) {
        console.log(`[DEBUG] Health check event: ${event.name}`);
      }
      void healthCheckHandler(event);
      return;
    }
  }

  // Handle regular events
  const handler = eventRegistry.getHandler(event.name);
  if (handler) {
    await handler(event);
  } else {
    console.log(`No handler registered for event type: ${event.name}`);
  }
}
