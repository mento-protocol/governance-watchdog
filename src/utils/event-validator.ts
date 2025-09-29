import { EventType, QuicknodeEvent } from "../types.js";

/**
 * Creates a generic event validator for common patterns
 */

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function createEventValidator<T extends QuicknodeEvent>(
  eventType: EventType,
  requiredFields: string[],
  additionalValidation?: (event: Record<string, unknown>) => boolean,
) {
  return function validateEvent(event: unknown): event is T {
    if (!event || typeof event !== "object" || !("name" in event)) {
      return false;
    }

    const eventObj = event as Record<string, unknown>;

    // Basic validation: event type and required fields
    const basicValidation =
      eventObj.name === eventType &&
      requiredFields.every((field) => field in eventObj);

    // If no additional validation provided, return basic validation
    if (!additionalValidation) {
      return basicValidation;
    }

    // Return basic validation AND additional validation
    return basicValidation && additionalValidation(eventObj);
  };
}
