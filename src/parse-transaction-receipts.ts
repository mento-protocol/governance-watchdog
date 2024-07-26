// External
import { decodeEventLog } from "viem";

// Internal
import GovernorABI from "./governor-abi.js";
import { HealthCheckEvent, ProposalCreatedEvent } from "./types.js";
import hasLogs from "./utils/has-logs.js";
import isHealthCheckEvent from "./utils/is-health-check-event.js";
import isProposalCreatedEvent from "./utils/is-proposal-created-event.js";
import isTransactionReceipt from "./utils/is-transaction-receipt.js";
import SortedOraclesABI from "./sorted-oracles-abi.js";

/**
 * Parse request body containing raw transaction receipts
 */
export default function parseTransactionReceipts(
  matchedTransactionReceipts: unknown,
): {
  block?: number;
  event: ProposalCreatedEvent | HealthCheckEvent;
  txHash: string;
}[] {
  const result = [];
  if (!Array.isArray(matchedTransactionReceipts)) {
    throw new Error(
      `Request body is not an array of transaction receipts but was: ${JSON.stringify(
        matchedTransactionReceipts,
      )}`,
    );
  }

  for (const receipt of matchedTransactionReceipts) {
    if (!isTransactionReceipt(receipt)) {
      throw new Error(
        `'receipt' is not of type 'TransactionReceipt': ${JSON.stringify(
          receipt,
        )}`,
      );
    }

    if (!hasLogs(receipt.logs)) {
      throw new Error(
        `Transaction receipt has invalid logs: ${JSON.stringify(receipt.logs)}`,
      );
    }

    for (const log of receipt.logs) {
      if (!log.topics) {
        throw new Error("No topics found in log");
      }

      try {
        const event = decodeEventLog({
          abi: GovernorABI,
          data: log.data as `0x${string}`,
          topics: log.topics as [
            signature: `0x${string}`,
            ...args: `0x${string}`[],
          ],
        });

        if (isProposalCreatedEvent(event)) {
          result.push({
            event,
            txHash: log.transactionHash,
          });
        }
        // eslint-disable-next-line no-empty
      } catch {}

      try {
        const event = decodeEventLog({
          abi: SortedOraclesABI,
          data: log.data as `0x${string}`,
          topics: log.topics as [
            signature: `0x${string}`,
            ...args: `0x${string}`[],
          ],
        });

        if (isHealthCheckEvent(event)) {
          result.push({
            block: Number(receipt.blockNumber),
            event,
            txHash: log.transactionHash,
          });
        }
        // eslint-disable-next-line no-empty
      } catch {}
    }
  }

  return result;
}
