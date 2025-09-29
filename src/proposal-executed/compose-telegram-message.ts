import { ProposalExecutedEvent, QuicknodeEvent } from "../types.js";

/**
 * Composes a Telegram message for a proposal executed event
 * @param event The parsed Quicknode webhook containing the event data
 * @returns A record of key-value pairs for the Telegram message
 */
export default function composeTelegramMessage(
  event: QuicknodeEvent & ProposalExecutedEvent,
) {
  return {
    Description: "The proposal has been executed successfully!",
    "Proposal Link": `https://governance.mento.org/proposals/${event.proposalId.toString()}`,
    "Execution Transaction": `https://celoscan.io/tx/${event.transactionHash}`,
  };
}
