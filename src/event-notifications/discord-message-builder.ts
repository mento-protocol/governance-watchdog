import { EmbedBuilder } from "discord.js";
import {
  createAddressLink,
  createBaseDiscordEmbed,
  createProposalLink,
  createTransactionLink,
} from "../utils/message-composition";

/**
 * Theme configuration for different event types
 */
interface MessageTheme {
  color: number;
  emoji: string;
  title: string;
}

/**
 * Discord message builder for proposal events
 */
export class DiscordMessageBuilder {
  private embed: EmbedBuilder;
  private content: string;

  constructor(theme: MessageTheme, description?: string) {
    this.embed = createBaseDiscordEmbed(theme.title, theme.color);
    this.content = theme.emoji;

    if (description) {
      this.embed.setDescription(description);
    }
  }

  /**
   * Add proposal link field
   */
  addProposalLink(proposalId: bigint): this {
    this.embed.addFields({
      name: "Proposal Link",
      value: createProposalLink(proposalId),
    });
    return this;
  }

  /**
   * Add transaction link field
   */
  addTransactionLink(transactionHash: string, label = "Transaction"): this {
    this.embed.addFields({
      name: `${label} Transaction`,
      value: createTransactionLink(transactionHash),
    });
    return this;
  }

  /**
   * Add proposer address field
   */
  addProposerLink(proposer: string): this {
    this.embed.addFields({
      name: "Proposer",
      value: createAddressLink(proposer),
    });
    return this;
  }

  /**
   * Add timelock ID field
   */
  addTimelockId(timelockId?: string): this {
    this.embed.addFields({
      name: "Timelock ID",
      value: timelockId ?? "N/A",
    });
    return this;
  }

  /**
   * Add execution time field
   */
  addExecutionTime(eta: bigint): this {
    const executionTime = new Date(Number(eta) * 1000).toUTCString();
    this.embed.addFields({
      name: "Execution Time",
      value: executionTime,
    });
    return this;
  }

  /**
   * Add custom field
   */
  addField(name: string, value: string): this {
    this.embed.addFields({ name, value });
    return this;
  }

  /**
   * Set custom content
   */
  setContent(content: string): this {
    this.content = content;
    return this;
  }

  /**
   * Build the final message
   */
  build(): { content: string; embed: EmbedBuilder } {
    return {
      content: this.content,
      embed: this.embed,
    };
  }
}
