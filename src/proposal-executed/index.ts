import sendDiscordNotification from "../send-discord-notification.js";
import sendTelegramNotification from "../send-telegram-notification.js";
import { EventType, QuickAlert } from "../types.js";
import composeDiscordMessage from "./compose-discord-message.js";
import composeTelegramMessage from "./compose-telegram-message.js";

export default async function handleProposalExecutedEvent(
  quickAlert: QuickAlert,
): Promise<void> {
  const { event, blockNumber } = quickAlert;
  if (event.eventName !== EventType.ProposalExecuted) {
    throw new Error("Expected ProposalExecuted event");
  }

  console.log("ProposalExecuted event from block", blockNumber);

  try {
    console.log("Sending Discord notification for ProposalExecuted event...");
    const discordMsg = composeDiscordMessage(quickAlert);
    await sendDiscordNotification(discordMsg.content, discordMsg.embed);
    console.log(
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
    const msgData = composeTelegramMessage(quickAlert);
    await sendTelegramNotification("✅ PROPOSAL EXECUTED ✅", msgData);
    console.log(
      "Successfully sent Telegram notification for ProposalExecuted event",
    );
  } catch (error) {
    console.error(
      "Failed to send Telegram notification for ProposalExecuted event:",
      error,
    );
  }
}
