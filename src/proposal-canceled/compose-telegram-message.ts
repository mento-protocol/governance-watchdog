import { ProposalCanceledEvent, QuicknodeEvent } from "../types.js";

/**
 * Composes a Telegram message for a proposal canceled event
 * @param event The parsed Quicknode webhook containing the event data
 * @returns A record of key-value pairs for the Telegram message
 */
export default function composeTelegramMessage(
  event: QuicknodeEvent & ProposalCanceledEvent,
) {
  return {
    Description: "The proposal has been canceled and will not proceed further.",
    "Proposal Link": `https://governance.mento.org/proposals/${event.proposalId.toString()}`,
    "Cancellation Transaction": `https://celoscan.io/tx/${event.transactionHash}`,
  };
}
