export default [
  {
    type: "constructor",
    stateMutability: "nonpayable",
    payable: false,
    inputs: [{ type: "bool", name: "test", internalType: "bool" }],
  },
  {
    type: "event",
    name: "BreakerBoxUpdated",
    inputs: [
      {
        type: "address",
        name: "newBreakerBox",
        internalType: "address",
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "EquivalentTokenSet",
    inputs: [
      {
        type: "address",
        name: "token",
        internalType: "address",
        indexed: true,
      },
      {
        type: "address",
        name: "equivalentToken",
        internalType: "address",
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MedianUpdated",
    inputs: [
      {
        type: "address",
        name: "token",
        internalType: "address",
        indexed: true,
      },
      {
        type: "uint256",
        name: "value",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OracleAdded",
    inputs: [
      {
        type: "address",
        name: "token",
        internalType: "address",
        indexed: true,
      },
      {
        type: "address",
        name: "oracleAddress",
        internalType: "address",
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OracleRemoved",
    inputs: [
      {
        type: "address",
        name: "token",
        internalType: "address",
        indexed: true,
      },
      {
        type: "address",
        name: "oracleAddress",
        internalType: "address",
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OracleReportRemoved",
    inputs: [
      {
        type: "address",
        name: "token",
        internalType: "address",
        indexed: true,
      },
      {
        type: "address",
        name: "oracle",
        internalType: "address",
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OracleReported",
    inputs: [
      {
        type: "address",
        name: "token",
        internalType: "address",
        indexed: true,
      },
      {
        type: "address",
        name: "oracle",
        internalType: "address",
        indexed: true,
      },
      {
        type: "uint256",
        name: "timestamp",
        internalType: "uint256",
        indexed: false,
      },
      {
        type: "uint256",
        name: "value",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        type: "address",
        name: "previousOwner",
        internalType: "address",
        indexed: true,
      },
      {
        type: "address",
        name: "newOwner",
        internalType: "address",
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ReportExpirySet",
    inputs: [
      {
        type: "uint256",
        name: "reportExpiry",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TokenReportExpirySet",
    inputs: [
      {
        type: "address",
        name: "token",
        internalType: "address",
        indexed: false,
      },
      {
        type: "uint256",
        name: "reportExpiry",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    payable: false,
    outputs: [],
    name: "addOracle",
    inputs: [
      { type: "address", name: "token", internalType: "address" },
      { type: "address", name: "oracleAddress", internalType: "address" },
    ],
    constant: false,
  },
  {
    type: "function",
    stateMutability: "view",
    payable: false,
    outputs: [
      { type: "address", name: "", internalType: "contract IBreakerBox" },
    ],
    name: "breakerBox",
    inputs: [],
    constant: true,
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    payable: false,
    outputs: [],
    name: "deleteEquivalentToken",
    inputs: [{ type: "address", name: "token", internalType: "address" }],
    constant: false,
  },
  {
    type: "function",
    stateMutability: "view",
    payable: false,
    outputs: [{ type: "address", name: "token", internalType: "address" }],
    name: "equivalentTokens",
    inputs: [{ type: "address", name: "", internalType: "address" }],
    constant: true,
  },
  {
    type: "function",
    stateMutability: "view",
    payable: false,
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "getEquivalentToken",
    inputs: [{ type: "address", name: "token", internalType: "address" }],
    constant: true,
  },
  {
    type: "function",
    stateMutability: "view",
    payable: false,
    outputs: [{ type: "address[]", name: "", internalType: "address[]" }],
    name: "getOracles",
    inputs: [{ type: "address", name: "token", internalType: "address" }],
    constant: true,
  },
  {
    type: "function",
    stateMutability: "view",
    payable: false,
    outputs: [
      { type: "address[]", name: "", internalType: "address[]" },
      { type: "uint256[]", name: "", internalType: "uint256[]" },
      {
        type: "uint8[]",
        name: "",
        internalType: "enum SortedLinkedListWithMedian.MedianRelation[]",
      },
    ],
    name: "getRates",
    inputs: [{ type: "address", name: "token", internalType: "address" }],
    constant: true,
  },
  {
    type: "function",
    stateMutability: "view",
    payable: false,
    outputs: [
      { type: "address[]", name: "", internalType: "address[]" },
      { type: "uint256[]", name: "", internalType: "uint256[]" },
      {
        type: "uint8[]",
        name: "",
        internalType: "enum SortedLinkedListWithMedian.MedianRelation[]",
      },
    ],
    name: "getTimestamps",
    inputs: [{ type: "address", name: "token", internalType: "address" }],
    constant: true,
  },
  {
    type: "function",
    stateMutability: "view",
    payable: false,
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "getTokenReportExpirySeconds",
    inputs: [{ type: "address", name: "token", internalType: "address" }],
    constant: true,
  },
  {
    type: "function",
    stateMutability: "pure",
    payable: false,
    outputs: [
      { type: "uint256", name: "", internalType: "uint256" },
      { type: "uint256", name: "", internalType: "uint256" },
      { type: "uint256", name: "", internalType: "uint256" },
      { type: "uint256", name: "", internalType: "uint256" },
    ],
    name: "getVersionNumber",
    inputs: [],
    constant: true,
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    payable: false,
    outputs: [],
    name: "initialize",
    inputs: [
      {
        type: "uint256",
        name: "_reportExpirySeconds",
        internalType: "uint256",
      },
    ],
    constant: false,
  },
  {
    type: "function",
    stateMutability: "view",
    payable: false,
    outputs: [{ type: "bool", name: "", internalType: "bool" }],
    name: "initialized",
    inputs: [],
    constant: true,
  },
  {
    type: "function",
    stateMutability: "view",
    payable: false,
    outputs: [
      { type: "bool", name: "", internalType: "bool" },
      { type: "address", name: "", internalType: "address" },
    ],
    name: "isOldestReportExpired",
    inputs: [{ type: "address", name: "token", internalType: "address" }],
    constant: true,
  },
  {
    type: "function",
    stateMutability: "view",
    payable: false,
    outputs: [{ type: "bool", name: "", internalType: "bool" }],
    name: "isOracle",
    inputs: [
      { type: "address", name: "", internalType: "address" },
      { type: "address", name: "", internalType: "address" },
    ],
    constant: true,
  },
  {
    type: "function",
    stateMutability: "view",
    payable: false,
    outputs: [{ type: "bool", name: "", internalType: "bool" }],
    name: "isOwner",
    inputs: [],
    constant: true,
  },
  {
    type: "function",
    stateMutability: "view",
    payable: false,
    outputs: [
      { type: "uint256", name: "", internalType: "uint256" },
      { type: "uint256", name: "", internalType: "uint256" },
    ],
    name: "medianRate",
    inputs: [{ type: "address", name: "token", internalType: "address" }],
    constant: true,
  },
  {
    type: "function",
    stateMutability: "view",
    payable: false,
    outputs: [
      { type: "uint256", name: "", internalType: "uint256" },
      { type: "uint256", name: "", internalType: "uint256" },
    ],
    name: "medianRateWithoutEquivalentMapping",
    inputs: [{ type: "address", name: "token", internalType: "address" }],
    constant: true,
  },
  {
    type: "function",
    stateMutability: "view",
    payable: false,
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "medianTimestamp",
    inputs: [{ type: "address", name: "token", internalType: "address" }],
    constant: true,
  },
  {
    type: "function",
    stateMutability: "view",
    payable: false,
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "numRates",
    inputs: [{ type: "address", name: "token", internalType: "address" }],
    constant: true,
  },
  {
    type: "function",
    stateMutability: "view",
    payable: false,
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "numTimestamps",
    inputs: [{ type: "address", name: "token", internalType: "address" }],
    constant: true,
  },
  {
    type: "function",
    stateMutability: "view",
    payable: false,
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "oracles",
    inputs: [
      { type: "address", name: "", internalType: "address" },
      { type: "uint256", name: "", internalType: "uint256" },
    ],
    constant: true,
  },
  {
    type: "function",
    stateMutability: "view",
    payable: false,
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "owner",
    inputs: [],
    constant: true,
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    payable: false,
    outputs: [],
    name: "removeExpiredReports",
    inputs: [
      { type: "address", name: "token", internalType: "address" },
      { type: "uint256", name: "n", internalType: "uint256" },
    ],
    constant: false,
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    payable: false,
    outputs: [],
    name: "removeOracle",
    inputs: [
      { type: "address", name: "token", internalType: "address" },
      { type: "address", name: "oracleAddress", internalType: "address" },
      { type: "uint256", name: "index", internalType: "uint256" },
    ],
    constant: false,
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    payable: false,
    outputs: [],
    name: "renounceOwnership",
    inputs: [],
    constant: false,
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    payable: false,
    outputs: [],
    name: "report",
    inputs: [
      { type: "address", name: "token", internalType: "address" },
      { type: "uint256", name: "value", internalType: "uint256" },
      { type: "address", name: "lesserKey", internalType: "address" },
      { type: "address", name: "greaterKey", internalType: "address" },
    ],
    constant: false,
  },
  {
    type: "function",
    stateMutability: "view",
    payable: false,
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "reportExpirySeconds",
    inputs: [],
    constant: true,
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    payable: false,
    outputs: [],
    name: "setBreakerBox",
    inputs: [
      {
        type: "address",
        name: "newBreakerBox",
        internalType: "contract IBreakerBox",
      },
    ],
    constant: false,
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    payable: false,
    outputs: [],
    name: "setEquivalentToken",
    inputs: [
      { type: "address", name: "token", internalType: "address" },
      { type: "address", name: "equivalentToken", internalType: "address" },
    ],
    constant: false,
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    payable: false,
    outputs: [],
    name: "setReportExpiry",
    inputs: [
      {
        type: "uint256",
        name: "_reportExpirySeconds",
        internalType: "uint256",
      },
    ],
    constant: false,
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    payable: false,
    outputs: [],
    name: "setTokenReportExpiry",
    inputs: [
      { type: "address", name: "_token", internalType: "address" },
      {
        type: "uint256",
        name: "_reportExpirySeconds",
        internalType: "uint256",
      },
    ],
    constant: false,
  },
  {
    type: "function",
    stateMutability: "view",
    payable: false,
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "tokenReportExpirySeconds",
    inputs: [{ type: "address", name: "", internalType: "address" }],
    constant: true,
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    payable: false,
    outputs: [],
    name: "transferOwnership",
    inputs: [{ type: "address", name: "newOwner", internalType: "address" }],
    constant: false,
  },
] as const;
