import { EventType } from "../types";

export default function getEventByTopic(topic: string): EventType {
  switch (topic) {
    // keccak256(abi.encodePacked("ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string)"))
    case "0x7d84a6263ae0d98d3329bd7b46bb4e8d6f98cd35a7adb45c274c8b7fd5ebd5e0":
      return EventType.ProposalCreated;

    // keccak256(abi.encodePacked("MedianUpdated(address,uint256)"))
    case "0xa9981ebfc3b766a742486e898f54959b050a66006dbce1a4155c1f84a08bcf41":
      return EventType.MedianUpdated;

    // keccak256(abi.encodePacked("ProposalQueued(uint256,uint256)"))
    case "0x9a2e42fd6722813d69113e7d0079d3d940171428df7373df9c7f7617cfda2892":
      return EventType.ProposalQueued;

    // keccak256(abi.encodePacked("ProposalExecuted(uint256)"))
    case "0x712ae1383f79ac853f8d882153778e0260ef8f03b504e2866e0593e04d2b291f":
      return EventType.ProposalExecuted;

    // keccak256(abi.encodePacked("ProposalCanceled(uint256)"))
    case "0x789cf55be980739dad1d0699b93b58e806b51c9d96619bfa8fe0a28abaa7b30c":
      return EventType.ProposalCanceled;

    default:
      return EventType.Unknown;
  }
}
