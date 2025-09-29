import { ProposalCanceledEvent, QuicknodeEvent } from "../types.js";
import {
  createBaseDiscordEmbed,
  createProposalLink,
  createTransactionLink,
} from "../utils/message-composition.js";

/**
 * Composes a Discord embed message for a proposal canceled event
 * @param webhook The parsed Quicknode webhook containing the event data
 * @returns An object containing the content and embed for the Discord message
 */
export default function composeDiscordMessage(
  event: QuicknodeEvent & ProposalCanceledEvent,
) {
  const proposalLink = createProposalLink(event.proposalId);
  const transactionLink = createTransactionLink(event.transactionHash);

  const embed = createBaseDiscordEmbed("Proposal Canceled", 0xff5252) // Red color for canceled proposals
    .setDescription(
      `The proposal has been canceled and will not proceed further.`,
    )
    .addFields({
      name: "Proposal Link",
      value: proposalLink,
    })
    .addFields({
      name: "Cancellation Transaction",
      value: transactionLink,
    });

  return {
    content: "❌ Proposal Canceled ❌",
    embed,
  };
}
