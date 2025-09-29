import { EmbedBuilder } from "discord.js";
import { ProposalCreatedEvent, QuicknodeEvent } from "../types.js";
import { safeJsonParseProperty } from "../utils/safe-json-parse.js";

/**
 * Composes a Discord embed message for a proposal created event
 * @param webhook The parsed Quicknode webhook containing the event data
 * @returns An object containing the content and embed for the Discord message
 */
export default function composeDiscordMessage(
  event: QuicknodeEvent & ProposalCreatedEvent,
) {
  const titleValue = safeJsonParseProperty(event.description, "title");
  const title =
    typeof titleValue === "string" ? titleValue : "Proposal Created";

  const proposalLink = `https://governance.mento.org/proposals/${event.proposalId.toString()}`;

  const embed = new EmbedBuilder()
    .setTitle(`Title: ${title}`)
    .addFields({
      name: "Proposal Link",
      value: proposalLink,
    })
    .addFields({
      name: "Proposer",
      value: `https://celoscan.io/address/${event.proposer}`,
    })
    .addFields({
      name: "Timelock ID",
      value: event.timelockId ?? "N/A",
    })
    .addFields({
      name: "Proposal Transaction",
      value: `https://celoscan.io/tx/${event.transactionHash}`,
    })
    .setColor(0xa6e5f6);

  return {
    content: "**📝 New Governance Proposal 📝**",
    embed,
  };
}
