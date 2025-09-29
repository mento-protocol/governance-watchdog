import { EmbedBuilder } from "discord.js";
import { ProposalCanceledEvent, QuicknodeEvent } from "./../types";

/**
 * Composes a Discord embed message for a proposal canceled event
 * @param webhook The parsed Quicknode webhook containing the event data
 * @returns An object containing the content and embed for the Discord message
 */
export default function composeDiscordMessage(
  event: QuicknodeEvent & ProposalCanceledEvent,
) {
  const proposalLink = `https://governance.mento.org/proposals/${event.proposalId.toString()}`;

  const embed = new EmbedBuilder()
    .setTitle("Proposal Canceled")
    .setDescription(
      `The proposal has been canceled and will not proceed further.`,
    )
    .addFields({
      name: "Proposal Link",
      value: proposalLink,
    })
    .addFields({
      name: "Cancellation Transaction",
      value: `https://celoscan.io/tx/${event.transactionHash}`,
    })
    .setColor(0xff5252); // Red color for canceled proposals

  return {
    content: "❌ Proposal Canceled ❌",
    embed,
  };
}
