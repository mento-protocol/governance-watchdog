import { QuicknodePayload } from "../events/types.js";

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
        typeof (event as Record<string, unknown>).address === "string" &&
        typeof (event as Record<string, unknown>).blockHash === "string" &&
        typeof (event as Record<string, unknown>).blockNumber === "string" &&
        typeof (event as Record<string, unknown>).logIndex === "string" &&
        typeof (event as Record<string, unknown>).name === "string" &&
        typeof (event as Record<string, unknown>).transactionHash === "string"
      );
    })
  );
}
