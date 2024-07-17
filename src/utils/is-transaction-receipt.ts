import type { TransactionReceipt } from "../types";

export default function isTransactionReceipt(
  obj: unknown,
): obj is TransactionReceipt {
  return obj !== null && typeof obj === "object" && "logs" in obj;
}
