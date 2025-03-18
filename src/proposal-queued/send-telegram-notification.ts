import config from "../config.js";
import getSecret from "../get-secret.js";
import { ProposalQueuedEvent } from "../types.js";
import getNotificationChannels from "../utils/get-notification-channels.js";

export default async function sendTelegramNotification(
  event: ProposalQueuedEvent,
  txHash: string,
) {
  const botToken = await getSecret(config.TELEGRAM_BOT_TOKEN_SECRET_ID);
  const botUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const executionTime = new Date(Number(event.args.eta) * 1000).toUTCString();

  const msgData = {
    Description:
      "A proposal has been queued and is awaiting execution. Please review the proposal and discuss with your fellow watchdogs whether it should be vetoed.",
    "Proposal Link": `https://governance.mento.org/proposals/${event.args.proposalId.toString()}`,
    "Execution Time": executionTime,
    "Queue Transaction": `https://celoscan.io/tx/${txHash}`,
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

function createFormattedMessage(msgData: Record<string, string>): string {
  let message = `<b>${escapeHTML("⏱️ Proposal Queued ⏱️")}</b>\n\n`;
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
