import assert from "assert/strict";
import sendDiscordNotification from "../send-discord-notification.js";
import sendTelegramNotification from "../send-telegram-notification.js";
import { QuicknodeEvent } from "../types.js";
import composeDiscordMessage from "./compose-discord-message.js";
import composeTelegramMessage from "./compose-telegram-message.js";
import isProposalQueuedEvent from "./is-proposal-queued-event.js";

export default async function handleProposalQueuedEvent(
  event: QuicknodeEvent,
): Promise<void> {
  assert(
    isProposalQueuedEvent(event),
    `Expected ProposalQueued event but was ${JSON.stringify(event)}`,
  );

  console.log("ProposalQueued event found at block", event.blockNumber);

  try {
    console.log("Sending Discord notification for ProposalQueued event...");
    const discordMsg = composeDiscordMessage(event);
    await sendDiscordNotification(discordMsg.content, discordMsg.embed);
    console.log(
      "Successfully sent Discord notification for ProposalQueued event",
    );
  } catch (error) {
    console.error(
      "Failed to send Discord notification for ProposalQueued event:",
      error,
    );
  }

  try {
    console.info("Sending Telegram notification for ProposalQueued event...");
    const msgData = composeTelegramMessage(event);
    await sendTelegramNotification("⏱️ PROPOSAL QUEUED ⏱️", msgData);
    console.log(
      "Successfully sent Telegram notification for ProposalQueued event",
    );
  } catch (error) {
    console.error(
      "Failed to send Telegram notification for ProposalQueued event:",
      error,
    );
  }
}
