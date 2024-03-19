// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ConsumerInterface {
    function rawFulfillRandomWord(uint256 requestId, uint256 randomWord) external; 
}