import type { DecodeEventLogReturnType } from "viem";
import type GovernorABI from "../governor-abi.js";
import type { ProposalCreatedEvent } from "../types.js";

export default function isProposalCreatedEvent(
  event: DecodeEventLogReturnType<typeof GovernorABI> | null | undefined,
): event is ProposalCreatedEvent {
  if (
    event === null ||
    event === undefined ||
    typeof event !== "object" ||
    !("args" in event)
  ) {
    return false;
  }
  return (
    "proposer" in event.args &&
    "description" in event.args &&
    "proposalId" in event.args
  );
}
