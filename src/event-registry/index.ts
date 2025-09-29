import { EventType, QuicknodeEvent } from "../types.js";
import {
  EventHandlerFunction,
  EventRegistryEntry,
  ExtendedEventHandlerConfig,
} from "./types.js";

/**
 * Event registry that manages all event handlers
 */
class EventRegistry {
  private handlers = new Map<EventType, EventRegistryEntry>();
  private specialHandlers = new Map<string, EventHandlerFunction>();

  /**
   * Register an event handler
   */
  register<T extends QuicknodeEvent>(
    config: ExtendedEventHandlerConfig<T>,
    handler: EventHandlerFunction,
  ): void {
    const entry: EventRegistryEntry = {
      eventType: config.eventType as EventType,
      handler,
      config: config as unknown as ExtendedEventHandlerConfig<QuicknodeEvent>,
    };

    this.handlers.set(config.eventType as EventType, entry);
  }

  /**
   * Register a special handler (like health checks)
   */
  registerSpecial(name: string, handler: EventHandlerFunction): void {
    this.specialHandlers.set(name, handler);
  }

  /**
   * Get handler for an event type
   */
  getHandler(eventType: EventType): EventHandlerFunction | undefined {
    const entry = this.handlers.get(eventType);
    return entry?.handler;
  }

  /**
   * Get special handler by name
   */
  getSpecialHandler(name: string): EventHandlerFunction | undefined {
    return this.specialHandlers.get(name);
  }

  /**
   * Get all registered event types
   */
  getRegisteredEventTypes(): EventType[] {
    return Array.from(this.handlers.keys());
  }

  /**
   * Get configuration for an event type
   */
  getConfig(
    eventType: EventType,
  ): ExtendedEventHandlerConfig<QuicknodeEvent> | undefined {
    const entry = this.handlers.get(eventType);
    return entry?.config;
  }

  /**
   * Check if an event type is registered
   */
  isRegistered(eventType: EventType): boolean {
    return this.handlers.has(eventType);
  }
}

// Global registry instance
export const eventRegistry = new EventRegistry();
