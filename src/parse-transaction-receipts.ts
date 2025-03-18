import assert from "assert/strict";

// External
import { decodeEventLog } from "viem";

// Internal
import GovernorABI from "./governor-abi.js";
import SortedOraclesABI from "./sorted-oracles-abi.js";
import TimelockControllerABI from "./timelock-controller-abi.js";
import { EventType, ParsedQuickAlert } from "./types.js";
import getEventByTopic from "./utils/get-event-by-topic.js";
import getProposaltimelockId from "./utils/get-time-lock-id.js";
import hasLogs from "./utils/has-logs.js";
import isCallScheduledEvent from "./utils/is-call-scheduled-event.js";
import isHealthCheckEvent from "./utils/is-health-check-event.js";
import isProposalCreatedEvent from "./utils/is-proposal-created-event.js";
import isTransactionReceipt from "./utils/is-transaction-receipt.js";

/**
 * Parse request body containing raw transaction receipts
 */
export default function parseTransactionReceipts(
  matchedTransactionReceipts: unknown,
): ParsedQuickAlert[] {
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
      assert(log.topics && log.topics.length > 0, "No topics found in log");

      const eventSignature = log.topics[0];
      const eventType = getEventByTopic(eventSignature);
      const blockNumber = Number(receipt.blockNumber);
      const txHash = log.transactionHash;

      switch (eventType) {
        case EventType.Unknown:
          // It can happen that a single transaction fires multiple events,
          // some of which we are not interested in
          continue;

        case EventType.ProposalCreated: {
          const event = decodeEventLog({
            abi: GovernorABI,
            data: log.data as `0x${string}`,
            topics: log.topics as [
              signature: `0x${string}`,
              ...args: `0x${string}`[],
            ],
          });

          assert(isProposalCreatedEvent(event));

          result.push({
            blockNumber,
            event,
            txHash,
            timelockId: getProposaltimelockId(event),
          });
          break;
        }

        case EventType.MedianUpdated: {
          const event = decodeEventLog({
            abi: SortedOraclesABI,
            data: log.data as `0x${string}`,
            topics: log.topics as [
              signature: `0x${string}`,
              ...args: `0x${string}`[],
            ],
          });

          assert(isHealthCheckEvent(event));

          result.push({
            blockNumber,
            event,
            txHash,
          });
          break;
        }

        case EventType.CallScheduled: {
          const event = decodeEventLog({
            abi: TimelockControllerABI,
            data: log.data as `0x${string}`,
            topics: log.topics as [
              signature: `0x${string}`,
              ...args: `0x${string}`[],
            ],
          });

          assert(isCallScheduledEvent(event));

          result.push({
            blockNumber,
            event,
            txHash,
            timelockId: event.args.id,
          });
          break;
        }

        default:
          assert(
            false,
            `Unknown event type. Did you forget to add a new event?`,
          );
      }
    }
  }

  return result;
}
