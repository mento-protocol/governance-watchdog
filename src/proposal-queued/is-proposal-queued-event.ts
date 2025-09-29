import { EventType, ProposalQueuedEvent, QuicknodeEvent } from "../types";

export default function isProposalQueuedEvent(
  event: unknown,
): event is QuicknodeEvent & ProposalQueuedEvent {
  return (
    event !== null &&
    event !== undefined &&
    typeof event === "object" &&
    "name" in event &&
    event.name === EventType.ProposalQueued &&
    "proposalId" in event &&
    "eta" in event
  );
}
