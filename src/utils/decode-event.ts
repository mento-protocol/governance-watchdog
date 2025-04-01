import { decodeEventLog, type DecodeEventLogReturnType } from "viem";
import GovernorABI from "../abis/governor.abi.js";
import SortedOraclesABI from "../abis/sorted-oracles.abi.js";
import type { LogsEntity } from "../types.js";

type ABI = typeof GovernorABI | typeof SortedOraclesABI;

/**
 * Decodes an event log using the provided ABI
 */
export function decodeEvent<T extends ABI>(
  log: LogsEntity,
  abi: T,
): DecodeEventLogReturnType<T> {
  return decodeEventLog({
    abi,
    data: log.data as `0x${string}`,
    topics: log.topics as [`0x${string}`, ...`0x${string}`[]],
  });
}

// Re-export the ABIs for convenience
export { GovernorABI, SortedOraclesABI };
