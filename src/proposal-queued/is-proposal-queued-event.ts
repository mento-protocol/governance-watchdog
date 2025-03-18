import { EventType, ProposalQueuedEvent } from "../types";

export default function isProposalQueuedEvent(
  event: unknown,
): event is ProposalQueuedEvent {
  return (
    typeof event === "object" &&
    event !== null &&
    "eventName" in event &&
    event.eventName === EventType.ProposalQueued &&
    "args" in event &&
    typeof event.args === "object" &&
    event.args !== null &&
    "proposalId" in event.args &&
    "eta" in event.args
  );
}
