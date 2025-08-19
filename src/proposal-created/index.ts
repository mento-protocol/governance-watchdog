import assert from "assert/strict";
import sendDiscordNotification from "../send-discord-notification.js";
import sendTelegramNotification from "../send-telegram-notification.js";
import { EventType, QuicknodeWebhook } from "../types.js";
import composeDiscordMessage from "./compose-discord-message.js";
import composeTelegramMessage from "./compose-telegram-message.js";

export default async function handleProposalCreatedEvent(
  webhook: QuicknodeWebhook,
): Promise<void> {
  const { event, timelockId, blockNumber } = webhook;
  if (event.eventName !== EventType.ProposalCreated) {
    throw new Error("Expected ProposalCreated event");
  }

  assert(timelockId, "Timelock ID is missing");

  console.info("ProposalCreated event found at block", blockNumber);

  try {
    console.info("Sending discord notification for ProposalCreated event...");
    const discordMsg = composeDiscordMessage(webhook);
    await sendDiscordNotification(discordMsg.content, discordMsg.embed);
    console.info(
      "Successfully sent Discord notification for ProposalCreated event",
    );
  } catch (error) {
    console.error(
      "Failed to send Discord notification for ProposalCreated event:",
      error,
    );
  }

  try {
    console.info("Sending telegram notification for ProposalCreated event...");
    const msgData = composeTelegramMessage(webhook);
    await sendTelegramNotification("🚨 NEW GOVERNANCE PROPOSAL 🚨", msgData);
    console.info(
      "Successfully sent Telegram notification for ProposalCreated event",
    );
  } catch (error) {
    console.error(
      "Failed to send Telegram notification for ProposalCreated event:",
      error,
    );
  }
}
