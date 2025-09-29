import { EmbedBuilder } from "discord.js";
import { ProposalExecutedEvent, QuicknodeEvent } from "../types.js";

/**
 * Composes a Discord embed message for a proposal executed event
 * @param event The parsed Quicknode webhook containing the event data
 * @returns An object containing the content and embed for the Discord message
 */
export default function composeDiscordMessage(
  event: QuicknodeEvent & ProposalExecutedEvent,
) {
  const proposalLink = `https://governance.mento.org/proposals/${event.proposalId.toString()}`;

  const embed = new EmbedBuilder()
    .setTitle("Proposal Executed")
    .setDescription(`The proposal has been executed successfully!`)
    .addFields({
      name: "Proposal Link",
      value: proposalLink,
    })
    .addFields({
      name: "Execution Transaction",
      value: `https://celoscan.io/tx/${event.transactionHash}`,
    })
    .setColor(0x4caf50); // Green color for executed proposals

  return {
    content: "✅ Proposal Executed ✅",
    embed,
  };
}
