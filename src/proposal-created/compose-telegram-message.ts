import type { QuickAlert } from "../types.js";
import { EventType } from "../types.js";

/**
 * Composes a Telegram message for a proposal created event
 * @param quickAlert The parsed quick alert containing the event data
 * @returns A record of key-value pairs for the Telegram message
 */
export default function composeTelegramMessage(quickAlert: QuickAlert) {
  const { event, timelockId, txHash } = quickAlert;
  if (event.eventName !== EventType.ProposalCreated) {
    throw new Error("Expected ProposalCreated event");
  }

  const { title } = JSON.parse(event.args.description) as {
    title: string;
  };

  return {
    Description: `Please review the proposal and check if anything looks off.`,
    Title: title,
    "Proposal Link": `https://governance.mento.org/proposals/${event.args.proposalId.toString()}`,
    "Proposal Transaction": `https://celoscan.io/tx/${txHash}`,
    "Proposer Address": `https://celoscan.io/address/${event.args.proposer}`,
    "Timelock ID": timelockId ?? "N/A",
  };
}
