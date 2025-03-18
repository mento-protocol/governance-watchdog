import { EmbedBuilder, WebhookClient } from "discord.js";
import getSecret from "../get-secret.js";
import type { ProposalQueuedEvent } from "../types.js";
import getNotificationChannels from "../utils/get-notification-channels.js";

export default async function sendDiscordNotification(
  event: ProposalQueuedEvent,
  txHash: string,
) {
  const executionTime = new Date(Number(event.args.eta) * 1000).toUTCString();

  const message = new EmbedBuilder()
    .setTitle("Proposal Queued")
    .setDescription(
      "A proposal has been queued and is awaiting execution. Please review the proposal and discuss with your fellow watchdogs whether it should be vetoed.",
    )
    .addFields({
      name: "Proposal ID",
      value: event.args.proposalId.toString(),
    })
    .addFields({
      name: "Execution Time",
      value: executionTime,
    })
    .addFields({
      name: "Transaction",
      value: `https://celoscan.io/tx/${txHash}`,
    })
    .setColor(0xf5a623); // Orange color for queued proposals

  const { discordWebhookUrlSecretId } = getNotificationChannels();

  const discordWebhookClient = new WebhookClient({
    url: await getSecret(discordWebhookUrlSecretId),
  });

  await discordWebhookClient.send({
    content: "⏱️ Proposal Queued ⏱️",
    embeds: [message],
  });
}
