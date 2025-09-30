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
    // Basic type checks
    if (!isObject(event) || !("name" in event)) {
      return false;
    }

    // Basic validation: event type and required fields
    const basicValidation =
      event.name === eventType &&
      requiredFields.every((field) => field in event);

    // If no additional validation provided, return basic validation
    if (!additionalValidation) {
      return basicValidation;
    }

    // Return basic validation AND additional validation
    return basicValidation && additionalValidation(event);
  };
}

/**
 * Type guard to check if a value is an object (but not array or null)
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
