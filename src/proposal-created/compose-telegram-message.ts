import { ProposalCreatedEvent, QuicknodeEvent } from "../types.js";
import {
  createAddressLink,
  createBaseTelegramMessage,
  createProposalLink,
  createTransactionLink,
} from "../utils/message-composition.js";
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
    ...createBaseTelegramMessage(
      `Please review the proposal and check if anything looks off.`,
    ),
    Title: title,
    "Proposal Link": createProposalLink(event.proposalId),
    "Proposal Transaction": createTransactionLink(event.transactionHash),
    "Proposer Address": createAddressLink(event.proposer),
    "Timelock ID": event.timelockId ?? "N/A",
  };
}
