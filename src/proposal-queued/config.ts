import { DiscordMessages } from "../event-notifications/discord-messages.js";
import { TelegramMessages } from "../event-notifications/telegram-messages.js";
import { EventType, ProposalQueuedEvent, QuicknodeEvent } from "../types.js";
import { createEventValidator } from "../utils/event-validator.js";

export const proposalQueuedConfig = {
  eventType: EventType.ProposalQueued,
  eventName: "ProposalQueued",
  validateEvent: createEventValidator<QuicknodeEvent & ProposalQueuedEvent>(
    EventType.ProposalQueued,
    ["proposalId", "eta"],
  ),
  composeDiscordMessage: DiscordMessages.proposalQueued,
  composeTelegramMessage: TelegramMessages.proposalQueued,
  discordEmoji: "⏱️ Proposal Queued ⏱️",
  telegramEmoji: "⏱️ PROPOSAL QUEUED ⏱️",
};
