import type { QuicknodeWebhook } from "../types.js";
import { EventType } from "../types.js";

/**
 * Composes a Telegram message for a proposal queued event
 * @param webhook The parsed Quicknode webhook containing the event data
 * @returns A record of key-value pairs for the Telegram message
 */
export default function composeTelegramMessage(webhook: QuicknodeWebhook) {
  const { event, txHash } = webhook;
  if (event.eventName !== EventType.ProposalQueued) {
    throw new Error("Expected ProposalQueued event");
  }

  const executionTime = new Date(Number(event.args.eta) * 1000).toUTCString();

  return {
    Description: `A proposal has been queued for execution on ${executionTime}. Please review the proposal and discuss with your fellow watchdogs if it should be vetoed.`,
    "Execution Time": executionTime,
    "Proposal Link": `https://governance.mento.org/proposals/${event.args.proposalId.toString()}`,
    "Queue Transaction": `https://celoscan.io/tx/${txHash}`,
    "How to Veto":
      "https://mentolabs.notion.site/Mento-Governance-Watchdogs-1c523e14987740c99fa7dedd490c0aa9#9324b6cbe737428c96166d8e66c29f02",
  };
}
