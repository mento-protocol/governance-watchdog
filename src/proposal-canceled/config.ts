import { DiscordMessages } from "../event-notifications/discord-messages.js";
import { TelegramMessages } from "../event-notifications/telegram-messages.js";
import { EventType, ProposalCanceledEvent, QuicknodeEvent } from "../types.js";
import { createEventValidator } from "../utils/event-validator.js";

export const proposalCanceledConfig = {
  eventType: EventType.ProposalCanceled,
  eventName: "ProposalCanceled",
  validateEvent: createEventValidator<QuicknodeEvent & ProposalCanceledEvent>(
    EventType.ProposalCanceled,
    ["proposalId"],
  ),
  composeDiscordMessage: DiscordMessages.proposalCanceled,
  composeTelegramMessage: TelegramMessages.proposalCanceled,
  discordEmoji: "**❌ Proposal Canceled ❌**",
  telegramEmoji: "❌ PROPOSAL CANCELED ❌",
};
