// Types
import type {
  HttpFunction,
  Request,
  Response,
} from "@google-cloud/functions-framework";
import parseTransactionReceipts from "./parse-transaction-receipts";
import sendDiscordNotification from "./send-discord-notification";
import sendTelegramNotification from "./send-telegram-notification";
// import validateRequestOrigin from "./validate-request-origin";

export const watchdogNotifier: HttpFunction = async (
  req: Request,
  res: Response,
) => {
  try {
    // TODO: Activate this after we've verified it's working via SortedOracle events
    // if (process.env.NODE_ENV !== "development") {
    //   await validateRequestOrigin(req);
    // }
    const parsedEvents = parseTransactionReceipts(req.body);

    for (const parsedEvent of parsedEvents) {
      await sendDiscordNotification(parsedEvent.event, parsedEvent.txHash);
      await sendTelegramNotification(parsedEvent.event, parsedEvent.txHash);
    }

    res.status(200).send("Event successfully processed");
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send("Something went wrong 🤔");
  }
};
