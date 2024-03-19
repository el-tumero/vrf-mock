// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

abstract contract ConsumerBase {

  address internal immutable vrfCoordinator;

  constructor(address _vrfCoordinator) {
    vrfCoordinator = _vrfCoordinator;
  }

  function fulfillRandomWord(uint256 requestId, uint256 randomWord) internal virtual;

  function rawFulfillRandomWord(uint256 requestId, uint256 randomWord) external {
    require(msg.sender == vrfCoordinator, "Only coordinator can fulfill!");
    fulfillRandomWord(requestId, randomWord);
  }
}