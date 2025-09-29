import { EventType, ProposalExecutedEvent, QuicknodeEvent } from "../types.js";
import { createEventValidator } from "../utils/event-validator.js";
import composeDiscordMessage from "./compose-discord-message.js";
import composeTelegramMessage from "./compose-telegram-message.js";

export const proposalExecutedConfig = {
  eventType: EventType.ProposalExecuted,
  eventName: "ProposalExecuted",
  validateEvent: createEventValidator<QuicknodeEvent & ProposalExecutedEvent>(
    EventType.ProposalExecuted,
    ["proposalId"],
  ),
  composeDiscordMessage,
  composeTelegramMessage,
  discordEmoji: "**✅ Proposal Executed ✅**",
  telegramEmoji: "✅ PROPOSAL EXECUTED ✅",
};
