import assert from "assert/strict";

// Types
import type {
  HttpFunction,
  Request,
  Response,
} from "@google-cloud/functions-framework";
import { EventType } from "./types.js";
import parseTransactionReceipts from "./parse-transaction-receipts";
import sendDiscordNotification from "./send-discord-notification";
import sendTelegramNotification from "./send-telegram-notification";

export const watchdogNotifier: HttpFunction = async (
  req: Request,
  res: Response,
) => {
  try {
    const parsedEvents = parseTransactionReceipts(req.body);

    for (const parsedEvent of parsedEvents) {
      switch (parsedEvent.event.eventName) {
        case EventType.ProposalCreated:
          await sendDiscordNotification(parsedEvent.event, parsedEvent.txHash);
          await sendTelegramNotification(parsedEvent.event, parsedEvent.txHash);
          break;
        case EventType.MedianUpdated:
          // Acts a health check/heartbeat for the service, as it's a frequently emitted event
          console.info("[HealthCheck]: Block", parsedEvent.block);
          break;
        default:
          assert(false, `Unknown event type from payload: ${req.body}`);
      }
    }

    res.status(200).send("Event successfully processed");
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send("Something went wrong 🤔");
  }
};
