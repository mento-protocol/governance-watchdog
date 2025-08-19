import type { QuicknodeWebhook } from "../types.js";
import { EventType } from "../types.js";

/**
 * Composes a Telegram message for a proposal executed event
 * @param webhook The parsed Quicknode webhook containing the event data
 * @returns A record of key-value pairs for the Telegram message
 */
export default function composeTelegramMessage(webhook: QuicknodeWebhook) {
  const { event, txHash } = webhook;
  if (event.eventName !== EventType.ProposalExecuted) {
    throw new Error("Expected ProposalExecuted event");
  }

  return {
    Description: "The proposal has been executed successfully!",
    "Proposal Link": `https://governance.mento.org/proposals/${event.args.proposalId.toString()}`,
    "Execution Transaction": `https://celoscan.io/tx/${txHash}`,
  };
}
