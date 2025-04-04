import { EmbedBuilder } from "discord.js";
import type { QuickAlert } from "../types.js";
import { EventType } from "../types.js";

/**
 * Composes a Discord embed message for a proposal canceled event
 * @param quickAlert The parsed quick alert containing the event data
 * @returns An object containing the content and embed for the Discord message
 */
export default function composeDiscordMessage(quickAlert: QuickAlert) {
  const { event, txHash } = quickAlert;
  if (event.eventName !== EventType.ProposalCanceled) {
    throw new Error("Expected ProposalCanceled event");
  }

  const proposalLink = `https://governance.mento.org/proposals/${event.args.proposalId.toString()}`;

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
      value: `https://celoscan.io/tx/${txHash}`,
    })
    .setColor(0xff5252); // Red color for canceled proposals

  return {
    content: "❌ Proposal Canceled ❌",
    embed,
  };
}
