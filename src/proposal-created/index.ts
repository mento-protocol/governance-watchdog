import assert from "assert/strict";
import { EventType, ParsedQuickAlert } from "../types.js";
import sendDiscordNotification from "./send-discord-notification.js";
import sendTelegramNotification from "./send-telegram-notification.js";

export default async function handleProposalCreatedEvent(
  quickAlert: ParsedQuickAlert,
): Promise<void> {
  if (quickAlert.event.eventName !== EventType.ProposalCreated) {
    throw new Error("Expected ProposalCreated event");
  }

  assert(quickAlert.timelockId, "Timelock ID is missing");

  console.info("ProposalCreated event found at block", quickAlert.blockNumber);

  try {
    console.info("Sending discord notification for ProposalCreated event...");
    await sendDiscordNotification(
      quickAlert.event,
      quickAlert.timelockId,
      quickAlert.txHash,
    );
  } catch (error) {
    console.error(
      "Failed to send Discord notification for ProposalCreated event:",
      error,
    );
  }

  try {
    console.info("Sending telegram notification for ProposalCreated event...");
    await sendTelegramNotification(
      quickAlert.event,
      quickAlert.timelockId,
      quickAlert.txHash,
    );
  } catch (error) {
    console.error(
      "Failed to send Telegram notification for ProposalCreated event:",
      error,
    );
  }
}
