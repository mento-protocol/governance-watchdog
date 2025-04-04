import type {
  HttpFunction,
  Request,
  Response,
} from "@google-cloud/functions-framework";
import assert from "assert/strict";
import handleHealthCheckEvent from "./health-check";
import parseTransactionReceipts from "./parse-transaction-receipts";
import handleProposalCanceledEvent from "./proposal-canceled";
import handleProposalCreatedEvent from "./proposal-created";
import handleProposalExecutedEvent from "./proposal-executed";
import handleProposalQueuedEvent from "./proposal-queued";
import handleTimelockChangeEvent from "./timelock-change";
import { EventType } from "./types.js";
import { getCacheSize, isDuplicate } from "./utils/event-deduplication.js";
import { hasAuthToken, isFromQuicknode } from "./utils/validate-request-origin";

export const governanceWatchdog: HttpFunction = async (
  req: Request,
  res: Response,
) => {
  const isProduction = process.env.NODE_ENV !== "development";
  try {
    /**
     * We only want to accept requests in production that
     *  1) Come from Quicknode
     *  2) or have an auth token (which we use for testing in production)
     */
    if (isProduction) {
      if (await isFromQuicknode(req)) {
        if (process.env.DEBUG) console.info("Received QuickAlert:", req.body);
      } else if (await hasAuthToken(req)) {
        console.info("Received Call with auth token:", req.body);
      } else {
        console.error("Unauthorized. Request origin validation failed.");
        res.status(401).send("Unauthorized");
        return;
      }
    }

    let eventsProcessed = 0;
    let eventsDeduplicated = 0;

    for (const quickAlert of parseTransactionReceipts(req.body)) {
      // Skip duplicated events to prevent sending multiple notifications
      if (isDuplicate(quickAlert)) {
        eventsDeduplicated++;
        continue;
      }

      eventsProcessed++;
      switch (quickAlert.event.eventName) {
        case EventType.ProposalCreated:
          console.log("[DEBUG] ProposalCreated Event Request Body:", req.body);
          await handleProposalCreatedEvent(quickAlert);
          break;

        case EventType.ProposalQueued:
          console.log("[DEBUG] ProposalQueued Event Request Body:", req.body);
          await handleProposalQueuedEvent(quickAlert);
          break;

        case EventType.ProposalExecuted:
          console.log("[DEBUG] ProposalExecuted Event Request Body:", req.body);
          await handleProposalExecutedEvent(quickAlert);
          break;

        case EventType.ProposalCanceled:
          await handleProposalCanceledEvent(quickAlert);
          break;

        case EventType.TimelockChange:
          await handleTimelockChangeEvent(quickAlert);
          break;

        // Acts a health check for the service, as it's a frequently emitted event
        case EventType.MedianUpdated:
          handleHealthCheckEvent(quickAlert);
          break;

        default:
          assert(
            false,
            `Unknown event type from payload: ${JSON.stringify(req.body)}`,
          );
      }
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
