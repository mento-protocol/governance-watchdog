import type {
  HttpFunction,
  Request,
  Response,
} from "@google-cloud/functions-framework";
import { processEvent } from "./events/process-event.js";
import { initializeEventRegistry } from "./events/registry.js";
import { getCacheSize, isDuplicate } from "./utils/event-deduplication.js";
import parseRequestBody from "./utils/parse-request-body.js";
import {
  hasAuthToken,
  isFromQuicknode,
} from "./utils/validate-request-origin.js";

// Initialize event registry at global scope to leverage Cloud Functions instance reuse
// This runs once per container instance (cold start), not on every invocation (warm start)
initializeEventRegistry();

export const governanceWatchdog: HttpFunction = async (
  req: Request,
  res: Response,
) => {
  const isProduction = process.env.NODE_ENV !== "development";

  try {
    /**
     * In production, we only want to accept requests that
     *  1) Come from Quicknode
     *  2) OR have an auth token (which we use for testing in production)
     */
    if (isProduction) {
      if (await isFromQuicknode(req)) {
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
      } else {
        eventsProcessed++;
      }

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
