import { EmbedBuilder, WebhookClient } from "discord.js";
import getSecret from "./get-secret.js";
import getNotificationChannels from "./utils/get-notification-channels.js";

/**
 * Generic Discord notification function that can be reused by different event handlers
 * @param content The content message that appears above the embed
 * @param embed The pre-configured Discord embed message
 * @returns Promise that resolves when the notification is sent
 */
export default async function sendDiscordNotification(
  content: string,
  embed: EmbedBuilder,
) {
  const { discordWebhookUrlSecretId } = getNotificationChannels();

  const discordWebhookClient = new WebhookClient({
    url: await getSecret(discordWebhookUrlSecretId),
  });

  await discordWebhookClient.send({
    content: content,
    embeds: [embed],
  });
}
