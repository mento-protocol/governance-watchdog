import type { TransactionReceipt } from "../types";
import { LogsEntity } from "./../types";

export default function hasLogs(
  logs: TransactionReceipt["logs"],
): logs is LogsEntity[] {
  const requiredProperties = [
    "address",
    "blockHash",
    "blockNumber",
    "data",
    "logIndex",
    "removed",
    "topics",
    "transactionHash",
    "transactionIndex",
  ];

  return (
    Array.isArray(logs) &&
    logs.length > 0 &&
    logs.every(
      (log) =>
        log !== null && requiredProperties.every((property) => property in log),
    )
  );
}
