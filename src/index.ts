// Types
import type {
  HttpFunction,
  Request,
  Response,
} from "@google-cloud/functions-framework";

// External
import { WebhookClient } from "discord.js";
import { decodeEventLog } from "viem";

// Internal
import buildDiscordMessage from "./build-discord-message.js";
import getDiscordWebhookUrl from "./get-discord-webhook-url.js";
import GovernorABI from "./governor-abi.js";
import hasLogs from "./utils/has-logs.js";
import isProposalCreatedEvent from "./utils/is-proposal-created-event.js";
import isTransactionReceipt from "./utils/is-transaction-receipt.js";

// For debugging with SortedOracles:
// import SortedOraclesABI from "./sorted-oracles-abi.js";

async function sendDiscordNotifications(matchedTransactionReceipts: unknown) {
  if (!Array.isArray(matchedTransactionReceipts)) {
    // TODO: Sentrify this
    console.error(
      "Request body is not an array of transaction receipts but was:",
      matchedTransactionReceipts,
    );
    return;
  }

  for (const receipt of matchedTransactionReceipts) {
    if (!isTransactionReceipt(receipt)) {
      // TODO: Sentrify this
      console.error("'receipt' is not of type 'TransactionReceipt':", receipt);
      return;
    }

    if (!hasLogs(receipt.logs)) {
      // TODO: Sentrify this
      console.error("Transaction receipt has invalid logs:", receipt.logs);
      return;
    }

    for (const log of receipt.logs) {
      if (!log.topics) {
        // TODO: Sentrify this
        console.error("No topics found in log");
        return;
      }

      const event = decodeEventLog({
        // For debugging with SortedOracles:
        // abi: SortedOraclesABI,
        abi: GovernorABI,
        data: log.data as `0x${string}`,
        topics: log.topics as [
          signature: `0x${string}`,
          ...args: `0x${string}`[],
        ],
      });

      if (!isProposalCreatedEvent(event)) {
        // TODO: Sentrify this
        console.error("Event is not a ProposalCreatedEvent:", event);
        return;
      }

      const discordWebhookClient = new WebhookClient({
        url: await getDiscordWebhookUrl(),
      });
      await discordWebhookClient.send({
        content: "🚨 New Governance Proposal 🚨",
        embeds: [buildDiscordMessage(event, log.transactionHash)],
      });
    }
  }
}

export const watchdogNotifier: HttpFunction = async (
  req: Request,
  res: Response,
) => {
  try {
    // Send Discord notifications (1 per event)
    await sendDiscordNotifications(req.body as unknown);

    res.status(200).send("Event successfully processed");
  } catch (error) {
    // TODO: Sentrify this
    console.error("Error processing request:", error);
    res.status(500).send("Something went wrong 🤔");
  }
};
