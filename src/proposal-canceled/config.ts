import { EventType, ProposalCanceledEvent, QuicknodeEvent } from "../types.js";
import { createEventValidator } from "../utils/event-validator.js";
import composeDiscordMessage from "./compose-discord-message.js";
import composeTelegramMessage from "./compose-telegram-message.js";

export const proposalCanceledConfig = {
  eventType: EventType.ProposalCanceled,
  eventName: "ProposalCanceled",
  validateEvent: createEventValidator<QuicknodeEvent & ProposalCanceledEvent>(
    EventType.ProposalCanceled,
    ["proposalId"],
  ),
  composeDiscordMessage,
  composeTelegramMessage,
  discordEmoji: "**❌ Proposal Canceled ❌**",
  telegramEmoji: "❌ PROPOSAL CANCELED ❌",
};
