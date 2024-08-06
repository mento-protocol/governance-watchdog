import type {
  HttpFunction,
  Request,
  Response,
} from "@google-cloud/functions-framework";
import assert from "assert/strict";
import parseTransactionReceipts from "./parse-transaction-receipts";
import sendDiscordNotification from "./send-discord-notification";
import sendTelegramNotification from "./send-telegram-notification";
import { EventType } from "./types.js";
import { hasAuthToken, isFromQuicknode } from "./validate-request-origin";

export const watchdogNotifier: HttpFunction = async (
  req: Request,
  res: Response,
) => {
  const isProduction = process.env.NODE_ENV !== "development";
  try {
    if (isProduction) {
      const isAuthorized =
        (await isFromQuicknode(req)) || (await hasAuthToken(req));

      if (!isAuthorized) {
        console.error("Origin validation failed for request.");
        res.status(401).send("Unauthorized");
        return;
      }
    }

    const parsedEvents = parseTransactionReceipts(req.body);

    for (const parsedEvent of parsedEvents) {
      switch (parsedEvent.event.eventName) {
        case EventType.ProposalCreated:
          assert(parsedEvent.timelockId, "Timelock ID is missing");

          await sendDiscordNotification(
            parsedEvent.event,
            parsedEvent.timelockId,
            parsedEvent.txHash,
          );

          await sendTelegramNotification(
            parsedEvent.event,
            parsedEvent.timelockId,
            parsedEvent.txHash,
          );

          break;

        case EventType.MedianUpdated:
          // Acts a health check/heartbeat for the service, as it's a frequently emitted event
          console.info("[HealthCheck]: Block", parsedEvent.block);
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
