import { ProposalExecutedEvent, QuicknodeEvent } from "../types.js";
import {
  createBaseTelegramMessage,
  createProposalLink,
  createTransactionLink,
} from "../utils/message-composition.js";

/**
 * Composes a Telegram message for a proposal executed event
 * @param event The parsed Quicknode webhook containing the event data
 * @returns A record of key-value pairs for the Telegram message
 */
export default function composeTelegramMessage(
  event: QuicknodeEvent & ProposalExecutedEvent,
) {
  return {
    ...createBaseTelegramMessage(
      "The proposal has been executed successfully!",
    ),
    "Proposal Link": createProposalLink(event.proposalId),
    "Execution Transaction": createTransactionLink(event.transactionHash),
  };
}
