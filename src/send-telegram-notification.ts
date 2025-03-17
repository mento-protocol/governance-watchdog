import config from "./config.js";
import getSecret from "./get-secret.js";
import { ProposalCreatedEvent } from "./types";
import getNotificationChannels from "./utils/get-notification-channels";

export default async function sendTelegramNotification(
  event: ProposalCreatedEvent,
  timelockId: string,
  txHash: string,
) {
  const botToken = await getSecret(config.TELEGRAM_BOT_TOKEN_SECRET_ID);
  const botUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const { title } = JSON.parse(event.args.description) as {
    title: string;
  };
  const msgData = {
    Title: title,
    "Proposal Link": `https://governance.mento.org/proposals/${event.args.proposalId.toString()}`,
    Proposer: `https://celoscan.io/address/${event.args.proposer}`,
    Event: event.eventName,
    Transaction: `https://celoscan.io/tx/${txHash}`,
    "Timelock ID": timelockId,
    Description: "Please review the full proposal in governance.mento.org",
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
  let message = `<b>${escapeHTML("🚨 NEW GOVERNANCE PROPOSAL 🚨")}</b>\n\n`;
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
