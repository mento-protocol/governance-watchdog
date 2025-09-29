import { EmbedBuilder } from "discord.js";

/**
 * Creates a proposal link URL
 */
export function createProposalLink(proposalId: bigint): string {
  return `https://governance.mento.org/proposals/${proposalId.toString()}`;
}

/**
 * Creates a transaction link URL
 */
export function createTransactionLink(txHash: string): string {
  return `https://celoscan.io/tx/${txHash}`;
}

/**
 * Creates an address link URL
 */
export function createAddressLink(address: string): string {
  return `https://celoscan.io/address/${address}`;
}

/**
 * Creates a base Discord embed with title and color
 */
export function createBaseDiscordEmbed(
  title: string,
  color: number,
): EmbedBuilder {
  return new EmbedBuilder().setTitle(title).setColor(color);
}

/**
 * Creates a base Telegram message with description
 */
export function createBaseTelegramMessage(
  description: string,
): Record<string, string> {
  return { Description: description };
}
