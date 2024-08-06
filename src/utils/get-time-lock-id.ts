import { encodeAbiParameters, keccak256, parseAbiParameters } from "viem";

import { ProposalCreatedEvent } from "../types";

/**
 * Given a ProposalCreatedEvent, calculate the corresponding timelock operation ID.
 * Governance Watchdogs need the timelock operation ID to veto queued proposals.
 *
 * The governor proposal ID and the timelock operation ID are not the same, which can
 * be confusing. They use different hashing mechanisms to calculate their respective IDs:
 * - Timelock Controller Operation IDs: https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/58fa0f81c4036f1a3b616fdffad2fd27e5d5ce21/contracts/governance/TimelockControllerUpgradeable.sol#L218
 * - Governor Proposal IDs: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/0a25c1940ca220686588c4af3ec526f725fe2582/contracts/governance/Governor.sol#L139
 */
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
