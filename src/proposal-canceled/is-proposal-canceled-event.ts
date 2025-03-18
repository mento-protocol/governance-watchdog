import { EventType, ProposalCanceledEvent } from "../types";

export default function isProposalCanceledEvent(
  event: unknown,
): event is ProposalCanceledEvent {
  return (
    typeof event === "object" &&
    event !== null &&
    "eventName" in event &&
    event.eventName === EventType.ProposalCanceled &&
    "args" in event &&
    typeof event.args === "object" &&
    event.args !== null &&
    "proposalId" in event.args
  );
}
