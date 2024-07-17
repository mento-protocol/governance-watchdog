import { EmbedBuilder } from "discord.js";
import type { ProposalCreatedEvent } from "./types";

export default function buildDiscordMessage(
  event: ProposalCreatedEvent,
  txHash: string,
): EmbedBuilder {
  const { title, description } = JSON.parse(event.args.description) as {
    title: string;
    description: string;
  };

  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .addFields({
      name: "Proposal Link",
      value: `https://governance.mento.org/proposals/${event.args.proposalId.toString()}`,
    })
    .addFields({
      name: "Proposer",
      value: `https://celoscan.io/address/${event.args.proposer}`,
    })
    .addFields({ name: "Event", value: event.eventName })
    .addFields({
      name: "Transaction",
      value: `https://celoscan.io/tx/${txHash}`,
    })
    .setColor(0xa6e5f6);
}
