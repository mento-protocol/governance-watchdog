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
  Unknown = "Unknown",
  ProposalCreated = "ProposalCreated",
  MedianUpdated = "MedianUpdated",
  CallScheduled = "CallScheduled",
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

export interface CallScheduledEvent {
  eventName: EventType.CallScheduled;
  args: {
    id: `0x${string}`;
    index: bigint;
    target: `0x${string}`;
    value: bigint;
    data: `0x${string}`;
    predecessor: `0x${string}`;
    delay: bigint;
  };
}

export interface ParsedQuickAlert {
  blockNumber: number;
  event: CallScheduledEvent | ProposalCreatedEvent | HealthCheckEvent;
  timelockId?: string;
  txHash: string;
}
