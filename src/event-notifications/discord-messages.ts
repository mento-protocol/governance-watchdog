import {
  ProposalCanceledEvent,
  ProposalCreatedEvent,
  ProposalExecutedEvent,
  ProposalQueuedEvent,
  QuicknodeEvent,
} from "../types";
import { DiscordMessageBuilder } from "./discord-message-builder";

/**
 * Common proposal event theme configurations
 */
const PROPOSAL_THEMES = {
  created: {
    color: 0xa6e5f6,
    emoji: "**📝 New Governance Proposal 📝**",
    title: "New Governance Proposal",
  },
  queued: {
    color: 0xf5a623,
    emoji: "⏱️ Proposal Queued ⏱️",
    title: "Proposal Queued",
  },
  executed: {
    color: 0x4caf50,
    emoji: "✅ Proposal Executed ✅",
    title: "Proposal Executed",
  },
  canceled: {
    color: 0xff5252,
    emoji: "❌ Proposal Canceled ❌",
    title: "Proposal Canceled",
  },
} as const;

/**
 * Factory functions for Discord messages
 */
export const DiscordMessages = {
  /**
   * Create Discord message for proposal created event
   */
  proposalCreated: (
    event: QuicknodeEvent & ProposalCreatedEvent & { timelockId?: string },
  ) => {
    const theme = PROPOSAL_THEMES.created;

    // Safely parse the description to extract title
    let title: string = theme.title;
    if (event.description) {
      try {
        const parsed = JSON.parse(event.description) as { title?: string };
        if (typeof parsed.title === "string") {
          title = parsed.title;
        }
      } catch {
        // If parsing fails, use the default title
        title = theme.title;
      }
    }

    return new DiscordMessageBuilder({ ...theme, title }, undefined)
      .setContent(theme.emoji)
      .addProposalLink(event.proposalId)
      .addProposerLink(event.proposer)
      .addTimelockId(event.timelockId)
      .addTransactionLink(event.transactionHash, "Proposal")
      .build();
  },

  /**
   * Create Discord message for proposal queued event
   */
  proposalQueued: (event: QuicknodeEvent & ProposalQueuedEvent) => {
    const theme = PROPOSAL_THEMES.queued;
    const executionTime = new Date(Number(event.eta) * 1000).toUTCString();

    return new DiscordMessageBuilder(
      theme,
      `A proposal has been queued for execution on ${executionTime}.`,
    )
      .addProposalLink(event.proposalId)
      .addExecutionTime(event.eta)
      .addTransactionLink(event.transactionHash, "Queue")
      .build();
  },

  /**
   * Create Discord message for proposal executed event
   */
  proposalExecuted: (event: QuicknodeEvent & ProposalExecutedEvent) => {
    const theme = PROPOSAL_THEMES.executed;

    return new DiscordMessageBuilder(
      theme,
      "The proposal has been executed successfully!",
    )
      .setContent(theme.emoji)
      .addProposalLink(event.proposalId)
      .addTransactionLink(event.transactionHash, "Execution")
      .build();
  },

  /**
   * Create Discord message for proposal canceled event
   */
  proposalCanceled: (event: QuicknodeEvent & ProposalCanceledEvent) => {
    const theme = PROPOSAL_THEMES.canceled;

    return new DiscordMessageBuilder(
      theme,
      "The proposal has been canceled and will not proceed further.",
    )
      .addProposalLink(event.proposalId)
      .addTransactionLink(event.transactionHash, "Cancellation")
      .build();
  },
};
