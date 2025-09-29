import { ProposalCreatedEvent, QuicknodeEvent } from "../types.js";
import { safeJsonParseProperty } from "../utils/safe-json-parse.js";

/**
 * Composes a Telegram message for a proposal created event
 * @param event The parsed Quicknode webhook containing the event data
 * @returns A record of key-value pairs for the Telegram message
 */
export default function composeTelegramMessage(
  event: QuicknodeEvent & ProposalCreatedEvent,
) {
  const titleValue = safeJsonParseProperty(event.description, "title");
  const title =
    typeof titleValue === "string" ? titleValue : "Proposal Created";

  return {
    Description: `Please review the proposal and check if anything looks off.`,
    Title: title,
    "Proposal Link": `https://governance.mento.org/proposals/${event.proposalId.toString()}`,
    "Proposal Transaction": `https://celoscan.io/tx/${event.transactionHash}`,
    "Proposer Address": `https://celoscan.io/address/${event.proposer}`,
    "Timelock ID": event.timelockId ?? "N/A",
  };
}
