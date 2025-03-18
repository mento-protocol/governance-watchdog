import { EventType, ProposalExecutedEvent } from "../types";

export default function isProposalExecutedEvent(
  event: unknown,
): event is ProposalExecutedEvent {
  return (
    typeof event === "object" &&
    event !== null &&
    "eventName" in event &&
    event.eventName === EventType.ProposalExecuted &&
    "args" in event &&
    typeof event.args === "object" &&
    event.args !== null &&
    "proposalId" in event.args
  );
}
