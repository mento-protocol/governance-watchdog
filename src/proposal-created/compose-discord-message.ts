import { EmbedBuilder } from "discord.js";
import type { QuicknodeWebhook } from "../types.js";
import { EventType } from "../types.js";

/**
 * Composes a Discord embed message for a proposal created event
 * @param webhook The parsed Quicknode webhook containing the event data
 * @returns An object containing the content and embed for the Discord message
 */
export default function composeDiscordMessage(webhook: QuicknodeWebhook) {
  const { event, timelockId, txHash } = webhook;

  if (event.eventName !== EventType.ProposalCreated) {
    throw new Error("Expected ProposalCreated event");
  }

  const { title } = JSON.parse(event.args.description) as {
    title: string;
  };

  const proposalLink = `https://governance.mento.org/proposals/${event.args.proposalId.toString()}`;

  const embed = new EmbedBuilder()
    .setTitle(`Title: ${title}`)
    .addFields({
      name: "Proposal Link",
      value: proposalLink,
    })
    .addFields({
      name: "Proposer",
      value: `https://celoscan.io/address/${event.args.proposer}`,
    })
    .addFields({
      name: "Timelock ID",
      value: timelockId ?? "N/A",
    })
    .addFields({
      name: "Proposal Transaction",
      value: `https://celoscan.io/tx/${txHash}`,
    })
    .setColor(0xa6e5f6);

  return {
    content: "**📝 New Governance Proposal 📝**",
    embed,
  };
}
