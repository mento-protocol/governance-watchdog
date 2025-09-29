import { EventType, ProposalCanceledEvent, QuicknodeEvent } from "../types";

export default function isProposalCanceledEvent(
  event: unknown,
): event is QuicknodeEvent & ProposalCanceledEvent {
  return (
    event !== null &&
    event !== undefined &&
    typeof event === "object" &&
    "name" in event &&
    event.name === EventType.ProposalCanceled &&
    "proposalId" in event
  );
}
