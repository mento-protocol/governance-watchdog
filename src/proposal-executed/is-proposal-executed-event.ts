import { EventType, ProposalExecutedEvent, QuicknodeEvent } from "../types";

export default function isProposalExecutedEvent(
  event: unknown,
): event is QuicknodeEvent & ProposalExecutedEvent {
  return (
    event !== null &&
    event !== undefined &&
    typeof event === "object" &&
    "name" in event &&
    event.name === EventType.ProposalExecuted &&
    "proposalId" in event
  );
}
