import assert from "assert/strict";
import sendDiscordNotification from "../send-discord-notification.js";
import sendTelegramNotification from "../send-telegram-notification.js";
import { QuicknodeEvent } from "../types.js";
import composeDiscordMessage from "./compose-discord-message.js";
import composeTelegramMessage from "./compose-telegram-message.js";
import isProposalCreatedEvent from "./is-proposal-created-event.js";

export default async function handleProposalCreatedEvent(
  event: QuicknodeEvent,
): Promise<void> {
  assert(
    isProposalCreatedEvent(event),
    `Expected ProposalCreated event but was ${JSON.stringify(event)}`,
  );

  console.info("ProposalCreated event found at block", event.blockNumber);

  try {
    console.info("Sending discord notification for ProposalCreated event...");
    const discordMsg = composeDiscordMessage(event);
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
    const msgData = composeTelegramMessage(event);
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
