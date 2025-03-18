import { EmbedBuilder, WebhookClient } from "discord.js";
import getSecret from "../get-secret.js";
import type { CallScheduledEvent } from "../types.js";
import getNotificationChannels from "../utils/get-notification-channels.js";

export default async function sendDiscordNotificationCallScheduled(
  event: CallScheduledEvent,
  timelockId: string,
  txHash: string,
) {
  const message = new EmbedBuilder()
    .setTitle("Proposal Queued in Timelock")
    .setDescription(
      "A proposal has been queued in the Timelock Controller and is awaiting execution. Please review the proposal and discuss with your fellow watchdogs whether it should be vetoed.",
    )
    .addFields({
      name: "Timelock ID",
      value: timelockId,
    })
    .addFields({
      name: "Target",
      value: `https://celoscan.io/address/${event.args.target}`,
    })
    .addFields({
      name: "Value",
      value: event.args.value.toString(),
    })
    .addFields({
      name: "Delay",
      value: `${(Number(event.args.delay) / 86400).toFixed(
        2,
      )} days (${event.args.delay.toString()} seconds)`,
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
    content: "⏱️ Proposal Queued in Timelock ⏱️",
    embeds: [message],
  });
}
