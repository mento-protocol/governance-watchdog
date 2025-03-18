import { EmbedBuilder } from "discord.js";
import type { QuickAlert } from "../types.js";
import { EventType } from "../types.js";

/**
 * Composes a Discord embed message for a timelock change event
 * @param quickAlert The parsed quick alert containing the event data
 * @returns An object containing the content and embed for the Discord message
 */
export default function composeDiscordMessage(quickAlert: QuickAlert) {
  const { event, txHash } = quickAlert;
  if (event.eventName !== EventType.TimelockChange) {
    throw new Error("Expected TimelockChange event");
  }

  const embed = new EmbedBuilder()
    .setTitle("Timelock Address Changed")
    .setDescription(
      `The timelock controller address has been updated. This is a significant governance change. Please review the changes carefully.`,
    )
    .addFields({
      name: "Old Timelock Address",
      value: `[${event.args.oldTimelock}](https://celoscan.io/address/${event.args.oldTimelock})`,
    })
    .addFields({
      name: "New Timelock Address",
      value: `[${event.args.newTimelock}](https://celoscan.io/address/${event.args.newTimelock})`,
    })
    .addFields({
      name: "Transaction",
      value: `https://celoscan.io/tx/${txHash}`,
    })
    .setColor(0xffd700); // Gold color for important governance changes

  return {
    content: "⚠️ TIMELOCK CONTROLLER CHANGED ⚠️",
    embed,
  };
}
