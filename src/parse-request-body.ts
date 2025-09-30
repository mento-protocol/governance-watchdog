import { EventType, QuicknodeEvent } from "./types.js";
import getProposalTimelockId from "./utils/get-proposal-time-lock-id.js";
import isValidQuicknodePayload from "./utils/is-valid-quicknode-payload.js";

/**
 * Parse request body containing parsed events from QuickNode
 */
export default function parseRequestBody(
  requestBody: unknown,
): QuicknodeEvent[] {
  // Validate that the request body has the expected structure
  if (!isValidQuicknodePayload(requestBody)) {
    throw new Error(
      `Request body is not a valid QuickNode payload: ${JSON.stringify(
        requestBody,
      )}`,
    );
  }

  const parsedEvents: QuicknodeEvent[] = [];

  for (const event of requestBody.result) {
    // Check if the event name is a valid EventType
    const eventType = Object.values(EventType).includes(event.name as EventType)
      ? (event.name as EventType)
      : EventType.Unknown;

    if (eventType === EventType.Unknown) {
      if (process.env.DEBUG) {
        console.log(`Skipping unknown event: '${event.name}'.`);
      }
      // Skip events we're not interested in
      continue;
    }

    parsedEvents.push({
      ...event,
      timelockId:
        event.name === EventType.ProposalCreated
          ? getProposalTimelockId(event)
          : undefined,
    });
  }

  return parsedEvents;
}
