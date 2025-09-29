import { EventType, ProposalCreatedEvent, QuicknodeEvent } from "../types.js";

export default function isProposalCreatedEvent(
  event: unknown,
): event is QuicknodeEvent & ProposalCreatedEvent {
  if (
    !event ||
    typeof event !== "object" ||
    !("name" in event) ||
    event.name !== EventType.ProposalCreated
  ) {
    return false;
  }

  const eventObj = event as Record<string, unknown>;

  // Check required fields exist
  const hasRequiredFields = [
    "calldatas",
    "description",
    "endBlock",
    "proposalId",
    "proposer",
    "signatures",
    "startBlock",
    "targets",
    "timelockId",
    "values",
  ].every((field) => field in eventObj);

  if (!hasRequiredFields) {
    return false;
  }

  // Check that calldatas, targets, and values are either string or array
  const isValidCalldatas =
    typeof eventObj.calldatas === "string" || Array.isArray(eventObj.calldatas);

  const isValidTargets =
    typeof eventObj.targets === "string" || Array.isArray(eventObj.targets);

  const isValidValues =
    typeof eventObj.values === "string" || Array.isArray(eventObj.values);

  const isValidSignatures =
    typeof eventObj.signatures === "string" ||
    Array.isArray(eventObj.signatures);

  return (
    isValidCalldatas && isValidTargets && isValidValues && isValidSignatures
  );
}
