/**
 * Infrastructure types for blockchain/QuickNode data structures
 * For event-specific types, see src/events/types.ts
 */

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
