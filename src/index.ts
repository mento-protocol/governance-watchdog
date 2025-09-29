import type {
  HttpFunction,
  Request,
  Response,
} from "@google-cloud/functions-framework";
import { initializeEventRegistry } from "./event-registry/initialize-event-registry.js";
import { processEvent } from "./event-registry/process-event.js";
import parseRequestBody from "./parse-request-body";
import { EventType } from "./types.js";
import { getCacheSize, isDuplicate } from "./utils/event-deduplication.js";
import { hasAuthToken, isFromQuicknode } from "./utils/validate-request-origin";

// Global type declaration for registry initialization flag
declare global {
  var eventRegistryInitialized: boolean | undefined;
}

export const governanceWatchdog: HttpFunction = async (
  req: Request,
  res: Response,
) => {
  const isProduction = process.env.NODE_ENV !== "development";

  // Initialize event registry on first run
  if (!globalThis.eventRegistryInitialized) {
    await initializeEventRegistry();
    globalThis.eventRegistryInitialized = true;
  }

  try {
    /**
     * We only want to accept requests in production that
     *  1) Come from Quicknode
     *  2) or have an auth token (which we use for testing in production)
     */
    if (isProduction) {
      if (await isFromQuicknode(req)) {
        if (process.env.DEBUG)
          console.info("Received Quicknode Webhook:", req.body);
      } else if (await hasAuthToken(req)) {
        console.info("Received Call with auth token:", req.body);
      } else {
        console.error("Unauthorized. Request origin validation failed.");
        res.status(401).send("Unauthorized");
        return;
      }
    }

    if (!req.body) {
      console.info("No events to process");
      res.status(200).send("No events to process");
      return;
    }

    if (req.body && typeof req.body === "object" && "error" in req.body) {
      console.error(
        "❌ Request body contains an error:",
        (req.body as { error: unknown }).error,
      );
      res.status(500).send("Something went wrong 🤔");
      return;
    }

    let eventsProcessed = 0;
    let eventsDeduplicated = 0;

    for (const quicknodeEvent of parseRequestBody(req.body)) {
      // Skip duplicated events to prevent sending multiple notifications
      if (isDuplicate(quicknodeEvent)) {
        eventsDeduplicated++;
        continue;
      }

      eventsProcessed++;

      // Log debug info for known event types
      if (quicknodeEvent.name !== EventType.MedianUpdated) {
        console.log(
          `[DEBUG] ${quicknodeEvent.name} Event Request Body:`,
          req.body,
        );
      }

      // Process event using registry
      await processEvent(quicknodeEvent);
    }

    if (eventsDeduplicated > 0) {
      console.log(
        `Events processed: ${String(
          eventsProcessed,
        )}, Events deduplicated: ${String(
          eventsDeduplicated,
        )}, Deduplication cache size: ${String(getCacheSize())}`,
      );
    }

    res.status(200).send("Event successfully processed");
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send("Something went wrong 🤔");
  }
};
