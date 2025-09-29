import { ProposalQueuedEvent, QuicknodeEvent } from "../types.js";
import {
  createBaseDiscordEmbed,
  createProposalLink,
  createTransactionLink,
} from "../utils/message-composition.js";

/**
 * Composes a Discord embed message for a proposal queued event
 * @param webhook The parsed Quicknode webhook containing the event data
 * @returns An object containing the content and embed for the Discord message
 */
export default function composeDiscordMessage(
  event: QuicknodeEvent & ProposalQueuedEvent,
) {
  const executionTime = new Date(Number(event.eta) * 1000).toUTCString();
  const proposalLink = createProposalLink(event.proposalId);
  const transactionLink = createTransactionLink(event.transactionHash);

  const embed = createBaseDiscordEmbed("Proposal Queued", 0xf5a623) // Orange color for queued proposals
    .setDescription(
      `A proposal has been queued for execution on ${executionTime}.`,
    )
    .addFields({
      name: "Proposal Link",
      value: proposalLink,
    })
    .addFields({
      name: "Execution Time",
      value: executionTime,
    })
    .addFields({
      name: "Queue Transaction",
      value: transactionLink,
    });

  return {
    content: "⏱️ Proposal Queued ⏱️",
    embed,
  };
}
