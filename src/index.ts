// Types
import type {
  HttpFunction,
  Request,
  Response,
} from "@google-cloud/functions-framework";
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
        case "ProposalCreated":
          await sendDiscordNotification(parsedEvent.event, parsedEvent.txHash);
          await sendTelegramNotification(parsedEvent.event, parsedEvent.txHash);
          break;
        case "MedianUpdated":
          console.info("[HealthCheck]: OK");
          break;
        default:
          console.warn("Unknown event type:", parsedEvent.event);
      }
    }

    res.status(200).send("Event successfully processed");
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send("Something went wrong 🤔");
  }
};
