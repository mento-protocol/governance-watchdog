import config from "../config";

/**
 * Returns the appropriate Discord webhook URL secret ID and Telegram chat ID
 * based on whether the application is in development or production mode.
 */
export default function getNotificationChannels() {
  const isDevelopment = process.env.NODE_ENV === "development";

  return {
    discordWebhookUrlSecretId:
      isDevelopment && config.DISCORD_TEST_WEBHOOK_URL_SECRET_ID
        ? config.DISCORD_TEST_WEBHOOK_URL_SECRET_ID
        : config.DISCORD_WEBHOOK_URL_SECRET_ID,

    telegramChatId:
      isDevelopment && config.TELEGRAM_TEST_CHAT_ID
        ? config.TELEGRAM_TEST_CHAT_ID
        : config.TELEGRAM_CHAT_ID,
  };
}
