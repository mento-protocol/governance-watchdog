import assert from "assert/strict";
import sendDiscordNotification from "../send-discord-notification.js";
import sendTelegramNotification from "../send-telegram-notification.js";
import { QuicknodeEvent } from "../types.js";
import composeDiscordMessage from "./compose-discord-message.js";
import composeTelegramMessage from "./compose-telegram-message.js";
import isProposalExecutedEvent from "./is-proposal-executed-event.js";

export default async function handleProposalExecutedEvent(
  event: QuicknodeEvent,
): Promise<void> {
  assert(
    isProposalExecutedEvent(event),
    `Expected ProposalExecuted event but was ${JSON.stringify(event)}`,
  );

  console.info("ProposalExecuted event found at block", event.blockNumber);

  try {
    console.info("Sending Discord notification for ProposalExecuted event...");
    const discordMsg = composeDiscordMessage(event);
    await sendDiscordNotification(discordMsg.content, discordMsg.embed);
    console.info(
      "Successfully sent Discord notification for ProposalExecuted event",
    );
  } catch (error) {
    console.error(
      "Failed to send Discord notification for ProposalExecuted event:",
      error,
    );
  }

  try {
    console.info("Sending Telegram notification for ProposalExecuted event...");
    const msgData = composeTelegramMessage(event);
    await sendTelegramNotification("✅ PROPOSAL EXECUTED ✅", msgData);
    console.info(
      "Successfully sent Telegram notification for ProposalExecuted event",
    );
  } catch (error) {
    console.error(
      "Failed to send Telegram notification for ProposalExecuted event:",
      error,
    );
  }
}
