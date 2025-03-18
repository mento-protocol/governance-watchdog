import assert from "assert/strict";
import { EventType, ParsedQuickAlert } from "../types.js";
import sendDiscordNotificationCallScheduled from "./send-discord-notification-call-scheduled.js";
import sendTelegramNotificationCallScheduled from "./send-telegram-notification-call-scheduled.js";

export default async function handleCallScheduledEvent(
  quickAlert: ParsedQuickAlert,
): Promise<void> {
  if (quickAlert.event.eventName !== EventType.CallScheduled) {
    throw new Error("Expected CallScheduled event");
  }

  assert(quickAlert.timelockId, "Timelock ID is missing");

  console.info("CallScheduled event found at block", quickAlert.blockNumber);

  try {
    console.info("Sending discord notification for CallScheduled event...");
    await sendDiscordNotificationCallScheduled(
      quickAlert.event,
      quickAlert.timelockId,
      quickAlert.txHash,
    );
  } catch (error) {
    console.error(
      "Failed to send Discord notification for CallScheduled event:",
      error,
    );
  }

  try {
    console.info("Sending telegram notification for CallScheduled event...");
    await sendTelegramNotificationCallScheduled(
      quickAlert.event,
      quickAlert.timelockId,
      quickAlert.txHash,
    );
  } catch (error) {
    console.error(
      "Failed to send Telegram notification for CallScheduled event:",
      error,
    );
  }
}
