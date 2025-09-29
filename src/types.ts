export interface TransactionReceipt {
  blockHash: string;
  blockNumber: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  effectiveGasPrice: string;
  from: string;
  gasUsed: string;
  logs?: (LogsEntity | null)[] | null;
  logsBloom: string;
  status: string;
  to: string;
  transactionHash: string;
  transactionIndex: string;
  type: string;
}
export interface LogsEntity {
  address: string;
  blockHash: string;
  blockNumber: string;
  data: string;
  logIndex: string;
  removed: boolean;
  topics?: string[] | null;
  transactionHash: string;
  transactionIndex: string;
}

export enum EventType {
  ProposalCreated = "ProposalCreated",
  ProposalQueued = "ProposalQueued",
  ProposalExecuted = "ProposalExecuted",
  ProposalCanceled = "ProposalCanceled",
  MedianUpdated = "MedianUpdated",
  Unknown = "Unknown",
}

export interface ProposalCreatedEvent {
  calldatas: `0x${string}` | readonly `0x${string}`[];
  description: string;
  endBlock: bigint;
  name: EventType.ProposalCreated;
  proposalId: bigint;
  proposer: `0x${string}`;
  signatures: string | readonly string[];
  startBlock: bigint;
  targets: `0x${string}` | readonly `0x${string}`[];
  values: bigint | readonly bigint[];
  version: number;
}

export interface MedianUpdatedEvent {
  name: EventType.MedianUpdated;
  token: `0x${string}`;
  value: bigint;
}

export interface ProposalQueuedEvent {
  name: EventType.ProposalQueued;
  proposalId: bigint;
  eta: bigint;
}

export interface ProposalExecutedEvent {
  name: EventType.ProposalExecuted;
  proposalId: bigint;
}

export interface ProposalCanceledEvent {
  name: EventType.ProposalCanceled;
  proposalId: bigint;
}

// QuickNode payload structure
export type QuicknodeEvent = {
  address: string;
  blockHash: string;
  blockNumber: string;
  logIndex: string;
  name: EventType;
  transactionHash: string;
  timelockId?: string;
} & (
  | ProposalCreatedEvent
  | ProposalQueuedEvent
  | ProposalExecutedEvent
  | ProposalCanceledEvent
  | MedianUpdatedEvent
);

export interface QuicknodePayload {
  result: QuicknodeEvent[];
}
