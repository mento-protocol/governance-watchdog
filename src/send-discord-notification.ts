import { EmbedBuilder, WebhookClient } from "discord.js";
import getDiscordWebhookUrl from "./get-discord-webhook-url.js";
import type { ProposalCreatedEvent } from "./types";

export default async function sendDiscordNotification(
  event: ProposalCreatedEvent,
  txHash: string,
) {
  const { title, description } = JSON.parse(event.args.description) as {
    title: string;
    description: string;
  };

  const message = new EmbedBuilder()
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

  const discordWebhookClient = new WebhookClient({
    url: await getDiscordWebhookUrl(),
  });

  await discordWebhookClient.send({
    content: "🚨 New Governance Proposal 🚨",
    embeds: [message],
  });
}