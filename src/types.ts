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
  TimelockChange = "TimelockChange",
  MedianUpdated = "MedianUpdated",
  Unknown = "Unknown",
}

export interface ProposalCreatedEvent {
  eventName: EventType.ProposalCreated;
  args: {
    calldatas: readonly `0x${string}`[];
    description: string;
    endBlock: bigint;
    proposalId: bigint;
    proposer: `0x${string}`;
    signatures: readonly string[];
    startBlock: bigint;
    targets: readonly `0x${string}`[];
    values: readonly bigint[];
    version: number;
  };
}

export interface HealthCheckEvent {
  eventName: EventType.MedianUpdated;
  args: {
    token: `0x${string}`;
    value: bigint;
  };
}

export interface ProposalQueuedEvent {
  eventName: EventType.ProposalQueued;
  args: {
    proposalId: bigint;
    eta: bigint;
  };
}

export interface ProposalExecutedEvent {
  eventName: EventType.ProposalExecuted;
  args: {
    proposalId: bigint;
  };
}

export interface ProposalCanceledEvent {
  eventName: EventType.ProposalCanceled;
  args: {
    proposalId: bigint;
  };
}

export interface TimelockChangeEvent {
  eventName: EventType.TimelockChange;
  args: {
    oldTimelock: `0x${string}`;
    newTimelock: `0x${string}`;
  };
}

export interface QuickAlert {
  blockNumber: number;
  event:
    | ProposalCreatedEvent
    | ProposalQueuedEvent
    | ProposalExecutedEvent
    | ProposalCanceledEvent
    | TimelockChangeEvent
    | HealthCheckEvent;
  timelockId?: string;
  txHash: string;
}
