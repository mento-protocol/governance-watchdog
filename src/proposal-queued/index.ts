import sendDiscordNotification from "../send-discord-notification.js";
import sendTelegramNotification from "../send-telegram-notification.js";
import { EventType, QuicknodeWebhook } from "../types.js";
import composeDiscordMessage from "./compose-discord-message.js";
import composeTelegramMessage from "./compose-telegram-message.js";

export default async function handleProposalQueuedEvent(
  webhook: QuicknodeWebhook,
): Promise<void> {
  const { event, blockNumber } = webhook;
  if (event.eventName !== EventType.ProposalQueued) {
    throw new Error("Expected ProposalQueued event");
  }

  console.log("ProposalQueued event from block", blockNumber);

  try {
    console.log("Sending Discord notification for ProposalQueued event...");
    const discordMsg = composeDiscordMessage(webhook);
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
    const msgData = composeTelegramMessage(webhook);
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
