import assert from "assert/strict";
import sendDiscordNotification from "../send-discord-notification.js";
import sendTelegramNotification from "../send-telegram-notification.js";
import { QuicknodeEvent } from "../types.js";
import composeDiscordMessage from "./compose-discord-message.js";
import composeTelegramMessage from "./compose-telegram-message.js";
import isProposalCanceledEvent from "./is-proposal-canceled-event.js";

export default async function handleProposalCanceledEvent(
  event: QuicknodeEvent,
): Promise<void> {
  assert(
    isProposalCanceledEvent(event),
    `Expected ProposalCanceled event but was ${JSON.stringify(event)}`,
  );

  console.info("ProposalCanceled event found at block", event.blockNumber);

  try {
    console.info("Sending Discord notification for ProposalCanceled event...");
    const discordMsg = composeDiscordMessage(event);
    await sendDiscordNotification(discordMsg.content, discordMsg.embed);
    console.info(
      "Successfully sent Discord notification for ProposalCanceled event",
    );
  } catch (error) {
    console.error(
      "Failed to send Discord notification for ProposalCanceled event:",
      error,
    );
  }

  try {
    console.info("Sending Telegram notification for ProposalCanceled event...");
    const msgData = composeTelegramMessage(event);
    await sendTelegramNotification("❌ PROPOSAL CANCELED ❌", msgData);
    console.info(
      "Successfully sent Telegram notification for ProposalCanceled event",
    );
  } catch (error) {
    console.error(
      "Failed to send Telegram notification for ProposalCanceled event:",
      error,
    );
  }
}
