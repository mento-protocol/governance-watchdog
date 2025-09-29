import { DiscordMessages } from "../event-notifications/discord-messages.js";
import { TelegramMessages } from "../event-notifications/telegram-messages.js";
import { EventType, ProposalExecutedEvent, QuicknodeEvent } from "../types.js";
import { createEventValidator } from "../utils/event-validator.js";

export const proposalExecutedConfig = {
  eventType: EventType.ProposalExecuted,
  eventName: "ProposalExecuted",
  validateEvent: createEventValidator<QuicknodeEvent & ProposalExecutedEvent>(
    EventType.ProposalExecuted,
    ["proposalId"],
  ),
  composeDiscordMessage: DiscordMessages.proposalExecuted,
  composeTelegramMessage: TelegramMessages.proposalExecuted,
  discordEmoji: "**✅ Proposal Executed ✅**",
  telegramEmoji: "✅ PROPOSAL EXECUTED ✅",
};
