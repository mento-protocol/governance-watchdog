import {
  createPublicClient,
  encodeAbiParameters,
  parseAbiParameters,
  http,
  decodeEventLog,
  TransactionReceipt,
  PublicClient,
  keccak256,
} from "viem";
import { mainnet } from "viem/chains";
import GovernorABI from "../governor-abi";

async function getTransactionReceiptAndDecodeLogs(
  client: PublicClient,
  txHash: `0x${string}`,
) {
  try {
    const receipt: TransactionReceipt = await client.getTransactionReceipt({
      hash: txHash,
    });

    for (const log of receipt.logs) {
      try {
        const decodedLog = decodeEventLog({
          abi: GovernorABI,
          data: log.data,
          topics: log.topics,
        });

        if (decodedLog.eventName !== "ProposalCreated") {
          continue;
        }

        console.log("Decoded event log", decodedLog);

        // @ts-ignore
        const { targets, values, calldatas, description } = decodedLog.args;
        const descriptionHash = keccak256(Buffer.from(description));

        const proposalId = keccak256(
          encodeAbiParameters(
            parseAbiParameters(
              "address[], uint256[], bytes[], uint256, bytes32",
            ),
            // _timelockIds[proposalId] = _timelock.hashOperationBatch(targets, values, calldatas, 0, descriptionHash);
            [targets, values, calldatas, 0n, descriptionHash],
          ),
        );

        console.log("Proposal timeLockId:", proposalId.toString());
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    }
  } catch (error) {
    console.error("Error fetching transaction receipt:", error);
  }
}

async function main() {
  if (process.argv.length !== 4) {
    console.error("Usage: npm run get-time-lock-id -- <RPC_URL> <TX_HASH>");
    process.exit(1);
  }

  const RPC_URL = process.argv[2];
  const TX_HASH = process.argv[3] as `0x${string}`;

  const client = createPublicClient({
    chain: mainnet,
    transport: http(RPC_URL),
  });

  await getTransactionReceiptAndDecodeLogs(client, TX_HASH);
}

main().then(() => {});
