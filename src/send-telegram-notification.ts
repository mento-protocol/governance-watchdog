import config from "./config.js";
import getSecret from "./get-secret.js";
import getNotificationChannels from "./utils/get-notification-channels.js";
import { createFormattedMessage } from "./utils/telegram.js";

/**
 * Sends a notification to Telegram with the provided message data
 * @param title The title for the notification message
 * @param msgData Key-value data to be included in the notification
 * @returns Promise that resolves when the notification is sent
 */
export default async function sendTelegramNotification(
  title: string,
  msgData: Record<string, string | number>,
) {
  const botToken = await getSecret(config.TELEGRAM_BOT_TOKEN_SECRET_ID);
  const botUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const formattedMessage = createFormattedMessage(title, msgData);
  const { telegramChatId } = getNotificationChannels();

  const payload = {
    chat_id: telegramChatId,
    text: formattedMessage,
    parse_mode: "HTML",
  };

  const response = await fetch(botUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to send telegram notification: ${errorData}`);
  }
}
