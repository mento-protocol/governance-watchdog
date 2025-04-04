import { EmbedBuilder } from "discord.js";
import type { QuickAlert } from "../types.js";
import { EventType } from "../types.js";

/**
 * Composes a Discord embed message for a proposal executed event
 * @param quickAlert The parsed quick alert containing the event data
 * @returns An object containing the content and embed for the Discord message
 */
export default function composeDiscordMessage(quickAlert: QuickAlert) {
  const { event, txHash } = quickAlert;
  if (event.eventName !== EventType.ProposalExecuted) {
    throw new Error("Expected ProposalExecuted event");
  }

  const proposalLink = `https://governance.mento.org/proposals/${event.args.proposalId.toString()}`;

  const embed = new EmbedBuilder()
    .setTitle("Proposal Executed")
    .setDescription(`The proposal has been executed successfully!`)
    .addFields({
      name: "Proposal Link",
      value: proposalLink,
    })
    .addFields({
      name: "Execution Transaction",
      value: `https://celoscan.io/tx/${txHash}`,
    })
    .setColor(0x4caf50); // Green color for executed proposals

  return {
    content: "✅ Proposal Executed ✅",
    embed,
  };
}
