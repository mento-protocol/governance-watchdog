import {
  createAddressLink,
  createBaseTelegramMessage,
  createProposalLink,
  createTransactionLink,
} from "../utils/message-composition";

/**
 * Telegram message builder for proposal events
 */

export class TelegramMessageBuilder {
  private fields: Record<string, string> = {};

  constructor(description: string) {
    this.fields = { ...createBaseTelegramMessage(description) };
  }

  /**
   * Add proposal link field
   */
  addProposalLink(proposalId: bigint): this {
    this.fields["Proposal Link"] = createProposalLink(proposalId);
    return this;
  }

  /**
   * Add transaction link field
   */
  addTransactionLink(transactionHash: string, label = "Transaction"): this {
    this.fields[`${label} Transaction`] =
      createTransactionLink(transactionHash);
    return this;
  }

  /**
   * Add proposer address field
   */
  addProposerLink(proposer: string): this {
    this.fields["Proposer Address"] = createAddressLink(proposer);
    return this;
  }

  /**
   * Add timelock ID field
   */
  addTimelockId(timelockId?: string): this {
    this.fields["Timelock ID"] = timelockId ?? "N/A";
    return this;
  }

  /**
   * Add execution time field
   */
  addExecutionTime(eta: bigint): this {
    const executionTime = new Date(Number(eta) * 1000).toUTCString();
    this.fields["Execution Time"] = executionTime;
    return this;
  }

  /**
   * Add custom field
   */
  addField(name: string, value: string): this {
    this.fields[name] = value;
    return this;
  }

  /**
   * Add title field
   */
  addTitle(title: string): this {
    this.fields.Title = title;
    return this;
  }

  /**
   * Build the final message
   */
  build(): Record<string, string> {
    return { ...this.fields };
  }
}
