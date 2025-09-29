import { ProposalExecutedEvent, QuicknodeEvent } from "../types.js";
import {
  createBaseDiscordEmbed,
  createProposalLink,
  createTransactionLink,
} from "../utils/message-composition.js";

/**
 * Composes a Discord embed message for a proposal executed event
 * @param event The parsed Quicknode webhook containing the event data
 * @returns An object containing the content and embed for the Discord message
 */
export default function composeDiscordMessage(
  event: QuicknodeEvent & ProposalExecutedEvent,
) {
  const proposalLink = createProposalLink(event.proposalId);
  const transactionLink = createTransactionLink(event.transactionHash);

  const embed = createBaseDiscordEmbed("Proposal Executed", 0x4caf50) // Green color for executed proposals
    .setDescription(`The proposal has been executed successfully!`)
    .addFields({
      name: "Proposal Link",
      value: proposalLink,
    })
    .addFields({
      name: "Execution Transaction",
      value: transactionLink,
    });

  return {
    content: "✅ Proposal Executed ✅",
    embed,
  };
}
