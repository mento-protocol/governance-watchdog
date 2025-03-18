import config from "../config.js";
import getSecret from "../get-secret.js";
import { CallScheduledEvent } from "../types";
import getNotificationChannels from "../utils/get-notification-channels";

export default async function sendTelegramNotificationCallScheduled(
  event: CallScheduledEvent,
  timelockId: string,
  txHash: string,
) {
  const botToken = await getSecret(config.TELEGRAM_BOT_TOKEN_SECRET_ID);
  const botUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const delayInDays = (Number(event.args.delay) / 86400).toFixed(2);

  const msgData = {
    "Timelock ID": timelockId,
    Target: `https://celoscan.io/address/${event.args.target}`,
    Value: event.args.value.toString(),
    Delay: `${delayInDays} days (${event.args.delay.toString()} seconds)`,
    Transaction: `https://celoscan.io/tx/${txHash}`,
    Description:
      "A proposal has been queued in the Timelock Controller and is awaiting execution.",
  };

  const formattedMessage = createFormattedMessage(msgData);
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

// Create a formatted message
function createFormattedMessage(msgData: Record<string, string | number>) {
  let message = `<b>${escapeHTML("⏱️ PROPOSAL QUEUED IN TIMELOCK ⏱️")}</b>\n\n`;
  for (const [key, value] of Object.entries(msgData)) {
    message += `<b>${escapeHTML(key)}:</b> ${escapeHTML(String(value))}\n\n`;
  }
  return message;
}

// Function to escape HTML special characters
function escapeHTML(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
