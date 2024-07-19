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

/**
 * Send 1 Discord notification per matched transaction receipt
 */
export default async function sendDiscordNotifications(
  matchedTransactionReceipts: unknown,
) {
  if (!Array.isArray(matchedTransactionReceipts)) {
    throw new Error(
      `Request body is not an array of transaction receipts but was: ${JSON.stringify(matchedTransactionReceipts)}`,
    );
  }

  for (const receipt of matchedTransactionReceipts) {
    if (!isTransactionReceipt(receipt)) {
      throw new Error(
        `'receipt' is not of type 'TransactionReceipt': ${JSON.stringify(receipt)}`,
      );
    }

    if (!hasLogs(receipt.logs)) {
      throw new Error(
        `Transaction receipt has invalid logs: ${JSON.stringify(receipt.logs)}`,
      );
    }

    for (const log of receipt.logs) {
      if (!log.topics) {
        throw new Error("No topics found in log");
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
        throw new Error(
          `Event is not a ProposalCreatedEvent: ${JSON.stringify(event)}`,
        );
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
