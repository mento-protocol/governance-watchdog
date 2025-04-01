import type { QuickAlert } from "../types.js";
import { EventType } from "../types.js";

/**
 * Composes a Telegram message for a proposal canceled event
 * @param quickAlert The parsed quick alert containing the event data
 * @returns A record of key-value pairs for the Telegram message
 */
export default function composeTelegramMessage(quickAlert: QuickAlert) {
  const { event, txHash } = quickAlert;
  if (event.eventName !== EventType.ProposalCanceled) {
    throw new Error("Expected ProposalCanceled event");
  }

  return {
    Description: "The proposal has been canceled and will not proceed further.",
    "Proposal Link": `https://governance.mento.org/proposals/${event.args.proposalId.toString()}`,
    "Cancellation Transaction": `https://celoscan.io/tx/${txHash}`,
  };
}
