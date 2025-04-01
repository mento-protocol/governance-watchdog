import type { QuickAlert } from "../types.js";
import { EventType } from "../types.js";

/**
 * Composes a Telegram message for a proposal executed event
 * @param quickAlert The parsed quick alert containing the event data
 * @returns A record of key-value pairs for the Telegram message
 */
export default function composeTelegramMessage(quickAlert: QuickAlert) {
  const { event, txHash } = quickAlert;
  if (event.eventName !== EventType.ProposalExecuted) {
    throw new Error("Expected ProposalExecuted event");
  }

  return {
    Description: "The proposal has been executed successfully!",
    "Proposal Link": `https://governance.mento.org/proposals/${event.args.proposalId.toString()}`,
    "Execution Transaction": `https://celoscan.io/tx/${txHash}`,
  };
}
