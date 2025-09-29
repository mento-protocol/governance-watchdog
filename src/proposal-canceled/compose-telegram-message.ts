import { ProposalCanceledEvent, QuicknodeEvent } from "../types.js";
import {
  createBaseTelegramMessage,
  createProposalLink,
  createTransactionLink,
} from "../utils/message-composition.js";

/**
 * Composes a Telegram message for a proposal canceled event
 * @param event The parsed Quicknode webhook containing the event data
 * @returns A record of key-value pairs for the Telegram message
 */
export default function composeTelegramMessage(
  event: QuicknodeEvent & ProposalCanceledEvent,
) {
  return {
    ...createBaseTelegramMessage(
      "The proposal has been canceled and will not proceed further.",
    ),
    "Proposal Link": createProposalLink(event.proposalId),
    "Cancellation Transaction": createTransactionLink(event.transactionHash),
  };
}
