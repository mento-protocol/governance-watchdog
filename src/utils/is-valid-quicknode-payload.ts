import { QuicknodePayload } from "../types";

/**
 * Check if the payload is a valid QuickNode payload
 */
export default function isValidQuicknodePayload(
  requestBody: unknown,
): requestBody is QuicknodePayload {
  return (
    typeof requestBody === "object" &&
    requestBody !== null &&
    "result" in requestBody &&
    Array.isArray((requestBody as QuicknodePayload).result) &&
    (requestBody as QuicknodePayload).result.every((event) => {
      return (
        typeof event === "object" &&
        "address" in event &&
        "blockHash" in event &&
        "blockNumber" in event &&
        "logIndex" in event &&
        "name" in event &&
        "transactionHash" in event
      );
    })
  );
}
