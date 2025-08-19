import sendDiscordNotification from "../send-discord-notification.js";
import sendTelegramNotification from "../send-telegram-notification.js";
import { EventType, QuicknodeWebhook } from "../types.js";
import composeDiscordMessage from "./compose-discord-message.js";
import composeTelegramMessage from "./compose-telegram-message.js";

export default async function handleProposalCanceledEvent(
  webhook: QuicknodeWebhook,
): Promise<void> {
  const { event, blockNumber } = webhook;
  if (event.eventName !== EventType.ProposalCanceled) {
    throw new Error("Expected ProposalCanceled event");
  }

  console.log("ProposalCanceled event from block", blockNumber);

  try {
    console.log("Sending Discord notification for ProposalCanceled event...");
    const discordMsg = composeDiscordMessage(webhook);
    await sendDiscordNotification(discordMsg.content, discordMsg.embed);
    console.log(
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
    const msgData = composeTelegramMessage(webhook);
    await sendTelegramNotification("❌ PROPOSAL CANCELED ❌", msgData);
    console.log(
      "Successfully sent Telegram notification for ProposalCanceled event",
    );
  } catch (error) {
    console.error(
      "Failed to send Telegram notification for ProposalCanceled event:",
      error,
    );
  }
}
