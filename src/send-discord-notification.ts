import { EmbedBuilder, hyperlink, WebhookClient } from "discord.js";
import getSecret from "./get-secret.js";
import type { ProposalCreatedEvent } from "./types";
import getNotificationChannels from "./utils/get-notification-channels";

export default async function sendDiscordNotification(
  event: ProposalCreatedEvent,
  timelockId: string,
  txHash: string,
) {
  const { title } = JSON.parse(event.args.description) as {
    title: string;
  };

  const proposalLink = `https://governance.mento.org/proposals/${event.args.proposalId.toString()}`;

  const message = new EmbedBuilder()
    .setTitle(title)
    .setDescription(
      "Please review the full proposal in " +
        hyperlink("governance.mento.org", proposalLink),
    )
    .addFields({
      name: "Proposal Link",
      value: proposalLink,
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
    .addFields({
      name: "Timelock ID",
      value: timelockId,
    })
    .setColor(0xa6e5f6);

  const { discordWebhookUrlSecretId } = getNotificationChannels();

  const discordWebhookClient = new WebhookClient({
    url: await getSecret(discordWebhookUrlSecretId),
  });

  await discordWebhookClient.send({
    content: "🚨 New Governance Proposal 🚨",
    embeds: [message],
  });
}
