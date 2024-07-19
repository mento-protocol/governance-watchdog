import config from "./config.js";
import getTelegramBotToken from "./get-telegram-bot-token";
import { ProposalCreatedEvent } from "./types";

export default async function sendTelegramNotification(
  event: ProposalCreatedEvent,
  txHash: string,
) {
  const botToken = await getTelegramBotToken();
  const botUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const { title, description } = JSON.parse(event.args.description) as {
    title: string;
    description: string;
  };
  const msgData = {
    Title: title,
    "Proposal Link": `https://governance.mento.org/proposals/${event.args.proposalId.toString()}`,
    Proposer: `https://celoscan.io/address/${event.args.proposer}`,
    Event: event.eventName,
    Transaction: `https://celoscan.io/tx/${txHash}`,
    Description: description,
  };

  const formattedMessage = createFormattedMessage(msgData);
  const payload = {
    chat_id: config.TELEGRAM_CHAT_ID,
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
