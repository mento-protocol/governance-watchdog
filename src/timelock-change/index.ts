import sendDiscordNotification from "../send-discord-notification.js";
import sendTelegramNotification from "../send-telegram-notification.js";
import { EventType, QuicknodeWebhook } from "../types.js";
import composeDiscordMessage from "./compose-discord-message.js";
import composeTelegramMessage from "./compose-telegram-message.js";

export default async function handleTimelockChangeEvent(
  webhook: QuicknodeWebhook,
): Promise<void> {
  const { event, blockNumber } = webhook;
  if (event.eventName !== EventType.TimelockChange) {
    throw new Error("Expected TimelockChange event");
  }

  console.log("TimelockChange event from block", blockNumber);

  try {
    console.log("Sending Discord notification for TimelockChange event...");
    const discordMsg = composeDiscordMessage(webhook);
    await sendDiscordNotification(discordMsg.content, discordMsg.embed);
    console.log(
      "Successfully sent Discord notification for TimelockChange event",
    );
  } catch (error) {
    console.error(
      "Failed to send Discord notification for TimelockChange event:",
      error,
    );
  }

  try {
    console.info("Sending Telegram notification for TimelockChange event...");
    const msgData = composeTelegramMessage(webhook);
    await sendTelegramNotification(
      "⚠️ TIMELOCK CONTROLLER CHANGED ⚠️",
      msgData,
    );
    console.log(
      "Successfully sent Telegram notification for TimelockChange event",
    );
  } catch (error) {
    console.error(
      "Failed to send Telegram notification for TimelockChange event:",
      error,
    );
  }
}
