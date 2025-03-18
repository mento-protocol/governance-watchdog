import type {
  HttpFunction,
  Request,
  Response,
} from "@google-cloud/functions-framework";
import assert from "assert/strict";
import handleHealthCheckEvent from "./health-check";
import parseTransactionReceipts from "./parse-transaction-receipts";
import handleProposalCreatedEvent from "./proposal-created";
import handleProposalExecutedEvent from "./proposal-executed";
import handleProposalQueuedEvent from "./proposal-queued";
import { EventType } from "./types.js";
import { hasAuthToken, isFromQuicknode } from "./validate-request-origin";

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
        console.info("Received QuickAlert:", req.body);
      } else if (await hasAuthToken(req)) {
        console.info("Received Call with auth token:", req.body);
      } else {
        console.error("Unauthorized. Request origin validation failed.");
        res.status(401).send("Unauthorized");
        return;
      }
    }

    for (const quickAlert of parseTransactionReceipts(req.body)) {
      switch (quickAlert.event.eventName) {
        case EventType.ProposalCreated:
          await handleProposalCreatedEvent(quickAlert);
          break;

        case EventType.ProposalQueued:
          await handleProposalQueuedEvent(quickAlert);
          break;

        case EventType.ProposalExecuted:
          await handleProposalExecutedEvent(quickAlert);
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

    res.status(200).send("Event successfully processed");
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send("Something went wrong 🤔");
  }
};
