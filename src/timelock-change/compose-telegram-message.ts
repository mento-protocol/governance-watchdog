import type { QuicknodeWebhook } from "../types.js";
import { EventType } from "../types.js";

/**
 * Composes a Telegram message for a timelock change event
 * @param webhook The parsed Quicknode webhook containing the event data
 * @returns A record of key-value pairs for the Telegram message
 */
export default function composeTelegramMessage(webhook: QuicknodeWebhook) {
  const { event, txHash } = webhook;
  if (event.eventName !== EventType.TimelockChange) {
    throw new Error("Expected TimelockChange event");
  }

  return {
    Description:
      "The timelock controller address has been updated. This is a significant governance change! Please review the changes and take action if necessary.",
    "Old Timelock Address": event.args.oldTimelock,
    "New Timelock Address": event.args.newTimelock,
    Transaction: `https://celoscan.io/tx/${txHash}`,
    "Important Note":
      "This change may impact governance security. Please review and verify this change is expected.",
  };
}
