// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ConsumerBase} from "./ConsumerBase.sol";
import {MockCoordinator} from "./MockCoordinator.sol";


contract MockConsumer is ConsumerBase {

    enum RequestState {
        NONE,
        SENT,
        FULFILLED
    }

    mapping(uint256=>RequestState) private requestsState;

    constructor(address _vrfCoordinator) ConsumerBase(_vrfCoordinator) {}

    uint256[] private randomWords;
    

    function requestRandomWord() external {
        uint256 requestId = MockCoordinator(vrfCoordinator).requestRandomWord();
        requestsState[requestId] = RequestState.SENT;
    }

    function fulfillRandomWord(uint256 requestId, uint256 randomWord) internal override {
        require(requestsState[requestId] == RequestState.SENT, "Wrong request id!");
        randomWords.push(randomWord);
        requestsState[requestId] = RequestState.FULFILLED;
    }

    function displayRandomWords() external view returns(uint256[] memory){
        return randomWords;
    }
}