import {
  ProposalCanceledEvent,
  ProposalCreatedEvent,
  ProposalExecutedEvent,
  ProposalQueuedEvent,
  QuicknodeEvent,
} from "../types";
import { TelegramMessageBuilder } from "./telegram-message-builder";

/**
 * Factory functions for Telegram messages
 */
export const TelegramMessages = {
  /**
   * Create Telegram message for proposal created event
   */
  proposalCreated: (
    event: QuicknodeEvent & ProposalCreatedEvent & { timelockId?: string },
  ) => {
    return new TelegramMessageBuilder(
      `Please review the proposal and check if anything looks off.`,
    )
      .addTitle("Proposal Created")
      .addProposalLink(event.proposalId)
      .addTransactionLink(event.transactionHash, "Proposal")
      .addProposerLink(event.proposer)
      .addTimelockId(event.timelockId)
      .build();
  },

  /**
   * Create Telegram message for proposal queued event
   */
  proposalQueued: (event: QuicknodeEvent & ProposalQueuedEvent) => {
    const executionTime = new Date(Number(event.eta) * 1000).toUTCString();

    return new TelegramMessageBuilder(
      `A proposal has been queued for execution on ${executionTime}. Please review the proposal and discuss with your fellow watchdogs if it should be vetoed.`,
    )
      .addExecutionTime(event.eta)
      .addProposalLink(event.proposalId)
      .addTransactionLink(event.transactionHash, "Queue")
      .addField(
        "How to Veto",
        "https://mentolabs.notion.site/Mento-Governance-Watchdogs-1c523e14987740c99fa7dedd490c0aa9#9324b6cbe737428c96166d8e66c29f02",
      )
      .build();
  },

  /**
   * Create Telegram message for proposal executed event
   */
  proposalExecuted: (event: QuicknodeEvent & ProposalExecutedEvent) => {
    return new TelegramMessageBuilder(
      "The proposal has been executed successfully!",
    )
      .addProposalLink(event.proposalId)
      .addTransactionLink(event.transactionHash, "Execution")
      .build();
  },

  /**
   * Create Telegram message for proposal canceled event
   */
  proposalCanceled: (event: QuicknodeEvent & ProposalCanceledEvent) => {
    return new TelegramMessageBuilder(
      "The proposal has been canceled and will not proceed further.",
    )
      .addProposalLink(event.proposalId)
      .addTransactionLink(event.transactionHash, "Cancellation")
      .build();
  },
};
