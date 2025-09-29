import { ProposalCreatedEvent, QuicknodeEvent } from "../types.js";
import {
  createAddressLink,
  createBaseDiscordEmbed,
  createProposalLink,
  createTransactionLink,
} from "../utils/message-composition.js";
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

  const proposalLink = createProposalLink(event.proposalId);
  const proposerLink = createAddressLink(event.proposer);
  const transactionLink = createTransactionLink(event.transactionHash);

  const embed = createBaseDiscordEmbed(`Title: ${title}`, 0xa6e5f6)
    .addFields({
      name: "Proposal Link",
      value: proposalLink,
    })
    .addFields({
      name: "Proposer",
      value: proposerLink,
    })
    .addFields({
      name: "Timelock ID",
      value: event.timelockId ?? "N/A",
    })
    .addFields({
      name: "Proposal Transaction",
      value: transactionLink,
    });

  return {
    content: "**📝 New Governance Proposal 📝**",
    embed,
  };
}
