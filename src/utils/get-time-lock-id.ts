import { encodeAbiParameters, parseAbiParameters, keccak256 } from "viem";

import { ProposalCreatedEvent } from "../types";

export default function getProposalTimeLockId(
  event: ProposalCreatedEvent,
): string {
  const { targets, values, calldatas, description } = event.args;
  const descriptionHash = keccak256(Buffer.from(description));

  return keccak256(
    encodeAbiParameters(
      parseAbiParameters("address[], uint256[], bytes[], uint256, bytes32"),
      // _timelockIds[proposalId] = _timelock.hashOperationBatch(targets, values, calldatas, 0, descriptionHash);
      [targets, values, calldatas, 0n, descriptionHash],
    ),
  );
}
