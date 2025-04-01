import assert from "assert/strict";

// External

// Internal
import isHealthCheckEvent from "./health-check/is-health-check-event.js";
import isProposalCanceledEvent from "./proposal-canceled/is-proposal-canceled-event.js";
import isProposalCreatedEvent from "./proposal-created/is-proposal-created-event.js";
import isProposalExecutedEvent from "./proposal-executed/is-proposal-executed-event.js";
import isProposalQueuedEvent from "./proposal-queued/is-proposal-queued-event.js";
import isTimelockChangeEvent from "./timelock-change/is-timelock-change-event.js";
import { EventType, QuickAlert } from "./types.js";
import {
  decodeEvent,
  GovernorABI,
  SortedOraclesABI,
} from "./utils/decode-event.js";
import getEventByTopic from "./utils/get-event-by-topic.js";
import getProposaltimelockId from "./utils/get-time-lock-id.js";
import hasLogs from "./utils/has-logs.js";
import isTransactionReceipt from "./utils/is-transaction-receipt.js";

/**
 * Parse request body containing raw transaction receipts
 */
export default function parseTransactionReceipts(
  matchedTransactionReceipts: unknown,
): QuickAlert[] {
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
          const event = decodeEvent(log, GovernorABI);
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
          const event = decodeEvent(log, SortedOraclesABI);
          assert(isHealthCheckEvent(event));

          result.push({
            blockNumber,
            event,
            txHash,
          });
          break;
        }

        case EventType.ProposalQueued: {
          const event = decodeEvent(log, GovernorABI);
          assert(isProposalQueuedEvent(event));

          result.push({
            blockNumber,
            event,
            txHash,
          });
          break;
        }

        case EventType.ProposalExecuted: {
          const event = decodeEvent(log, GovernorABI);
          assert(isProposalExecutedEvent(event));

          result.push({
            blockNumber,
            event,
            txHash,
          });
          break;
        }

        case EventType.ProposalCanceled: {
          const event = decodeEvent(log, GovernorABI);
          assert(isProposalCanceledEvent(event));

          result.push({
            blockNumber,
            event,
            txHash,
          });
          break;
        }

        case EventType.TimelockChange: {
          const event = decodeEvent(log, GovernorABI);
          assert(isTimelockChangeEvent(event));

          result.push({
            blockNumber,
            event,
            txHash,
          });
          break;
        }

        default:
          assert(
            false,
            `Unknown event type from payload: ${JSON.stringify(log)}`,
          );
      }
    }
  }

  return result;
}
