import { EmbedBuilder } from "discord.js";
import type { QuicknodeWebhook } from "../types.js";
import { EventType } from "../types.js";

/**
 * Composes a Discord embed message for a proposal queued event
 * @param webhook The parsed Quicknode webhook containing the event data
 * @returns An object containing the content and embed for the Discord message
 */
export default function composeDiscordMessage(webhook: QuicknodeWebhook) {
  const { event, txHash } = webhook;
  if (event.eventName !== EventType.ProposalQueued) {
    throw new Error("Expected ProposalQueued event");
  }

  const executionTime = new Date(Number(event.args.eta) * 1000).toUTCString();
  const proposalLink = `https://governance.mento.org/proposals/${event.args.proposalId.toString()}`;

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
      value: `https://celoscan.io/tx/${txHash}`,
    })
    .setColor(0xf5a623); // Orange color for queued proposals

  return {
    content: "⏱️ Proposal Queued ⏱️",
    embed,
  };
}
