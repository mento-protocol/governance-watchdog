import { EventType, ParsedQuickAlert } from "../types.js";
import sendDiscordNotification from "./send-discord-notification.js";
import sendTelegramNotification from "./send-telegram-notification.js";

export default async function handleProposalQueuedEvent(
  quickAlert: ParsedQuickAlert,
): Promise<void> {
  if (quickAlert.event.eventName !== EventType.ProposalQueued) {
    throw new Error("Expected ProposalQueued event");
  }

  console.log("ProposalQueued event from block", quickAlert.blockNumber);

  try {
    console.log("Sending Discord notification for ProposalQueued event...");
    await sendDiscordNotification(quickAlert.event, quickAlert.txHash);
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
    await sendTelegramNotification(quickAlert.event, quickAlert.txHash);
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
