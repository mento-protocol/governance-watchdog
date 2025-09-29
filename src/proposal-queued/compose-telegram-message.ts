import { ProposalQueuedEvent, QuicknodeEvent } from "../types.js";
import {
  createBaseTelegramMessage,
  createProposalLink,
  createTransactionLink,
} from "../utils/message-composition.js";

/**
 * Composes a Telegram message for a proposal queued event
 * @param event The parsed Quicknode webhook containing the event data
 * @returns A record of key-value pairs for the Telegram message
 */
export default function composeTelegramMessage(
  event: QuicknodeEvent & ProposalQueuedEvent,
) {
  const executionTime = new Date(Number(event.eta) * 1000).toUTCString();

  return {
    ...createBaseTelegramMessage(
      `A proposal has been queued for execution on ${executionTime}. Please review the proposal and discuss with your fellow watchdogs if it should be vetoed.`,
    ),
    "Execution Time": executionTime,
    "Proposal Link": createProposalLink(event.proposalId),
    "Queue Transaction": createTransactionLink(event.transactionHash),
    "How to Veto":
      "https://mentolabs.notion.site/Mento-Governance-Watchdogs-1c523e14987740c99fa7dedd490c0aa9#9324b6cbe737428c96166d8e66c29f02",
  };
}
