import { EmbedBuilder } from "discord.js";
import { ProposalQueuedEvent, QuicknodeEvent } from "../types.js";

/**
 * Composes a Discord embed message for a proposal queued event
 * @param webhook The parsed Quicknode webhook containing the event data
 * @returns An object containing the content and embed for the Discord message
 */
export default function composeDiscordMessage(
  event: QuicknodeEvent & ProposalQueuedEvent,
) {
  const executionTime = new Date(Number(event.eta) * 1000).toUTCString();
  const proposalLink = `https://governance.mento.org/proposals/${event.proposalId.toString()}`;

  const embed = new EmbedBuilder()
    .setTitle("Proposal Queued")
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
      value: `https://celoscan.io/tx/${event.transactionHash}`,
    })
    .setColor(0xf5a623); // Orange color for queued proposals

  return {
    content: "⏱️ Proposal Queued ⏱️",
    embed,
  };
}
