import { EventType } from "../types";

export default function getEventByTopic(topic: string): EventType {
  switch (topic) {
    // keccak256(abi.encodePacked("ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string)"))
    case "0x7d84a6263ae0d98d3329bd7b46bb4e8d6f98cd35a7adb45c274c8b7fd5ebd5e0":
      return EventType.ProposalCreated;
    // keccak256(abi.encodePacked("MedianUpdated(address,uint256)"))
    case "0xa9981ebfc3b766a742486e898f54959b050a66006dbce1a4155c1f84a08bcf41":
      return EventType.MedianUpdated;
    // keccak256(abi.encodePacked("CallScheduled(bytes32,uint256,address,uint256,bytes,bytes32,uint256)"))
    case "0x4cf4410cc57040e44862ef0f45f3dd5a5e02db8eb8add648d4b0e236f1d07dca":
      return EventType.CallScheduled;
    default:
      return EventType.Unknown;
  }
}
