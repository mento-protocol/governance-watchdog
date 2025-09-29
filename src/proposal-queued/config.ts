import { EventType, ProposalQueuedEvent, QuicknodeEvent } from "../types.js";
import { createEventValidator } from "../utils/event-validator.js";
import composeDiscordMessage from "./compose-discord-message.js";
import composeTelegramMessage from "./compose-telegram-message.js";

export const proposalQueuedConfig = {
  eventType: EventType.ProposalQueued,
  eventName: "ProposalQueued",
  validateEvent: createEventValidator<QuicknodeEvent & ProposalQueuedEvent>(
    EventType.ProposalQueued,
    ["proposalId", "eta"],
  ),
  composeDiscordMessage,
  composeTelegramMessage,
  discordEmoji: "⏱️ Proposal Queued ⏱️",
  telegramEmoji: "⏱️ PROPOSAL QUEUED ⏱️",
};
