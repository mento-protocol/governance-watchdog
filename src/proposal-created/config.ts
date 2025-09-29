import { DiscordMessages } from "../event-notifications/discord-messages.js";
import { TelegramMessages } from "../event-notifications/telegram-messages.js";
import { EventType, ProposalCreatedEvent, QuicknodeEvent } from "../types.js";
import { createEventValidator } from "../utils/event-validator.js";

export const proposalCreatedConfig = {
  eventType: EventType.ProposalCreated,
  eventName: "ProposalCreated",
  validateEvent: createEventValidator<QuicknodeEvent & ProposalCreatedEvent>(
    EventType.ProposalCreated,
    [
      "calldatas",
      "description",
      "endBlock",
      "proposalId",
      "proposer",
      "signatures",
      "startBlock",
      "targets",
      "timelockId",
      "values",
    ],
    // Additional validation for complex field types
    (eventObj) => {
      // Check that calldatas, targets, and values are either string or array
      const isValidCalldatas =
        typeof eventObj.calldatas === "string" ||
        Array.isArray(eventObj.calldatas);

      const isValidTargets =
        typeof eventObj.targets === "string" || Array.isArray(eventObj.targets);

      const isValidValues =
        typeof eventObj.values === "string" || Array.isArray(eventObj.values);

      const isValidSignatures =
        typeof eventObj.signatures === "string" ||
        Array.isArray(eventObj.signatures);

      return (
        isValidCalldatas && isValidTargets && isValidValues && isValidSignatures
      );
    },
  ),
  composeDiscordMessage: DiscordMessages.proposalCreated,
  composeTelegramMessage: TelegramMessages.proposalCreated,
  discordEmoji: "**📝 New Governance Proposal 📝**",
  telegramEmoji: "🚨 NEW GOVERNANCE PROPOSAL 🚨",
};
