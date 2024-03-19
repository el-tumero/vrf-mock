// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ConsumerInterface} from "./ConsumerInterface.sol";
import "@openzeppelin/contracts/utils/structs/DoubleEndedQueue.sol";

import "hardhat/console.sol";

contract MockCoordinator {
    using DoubleEndedQueue for DoubleEndedQueue.Bytes32Deque;

    DoubleEndedQueue.Bytes32Deque private pendingRequests;


    enum RequestState {
        NONE,
        EXISTS,
        EXECUTED
    }

    struct Request {
        address requestor;
        bytes32 input;
        RequestState state;
    }

    address public immutable operator;

    uint256 private _nextRequestId;
    mapping(uint256=>Request) private requests;

    event RequestReceived(uint256 requestId, bytes32 input);

    constructor(address _operator) {
        operator = _operator;
    }

    function execute(uint256 requestId, uint8 v, bytes32 r, bytes32 s) external {
        Request storage req = requests[requestId];
        require(req.state == RequestState.EXISTS);
        bytes32 hash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", req.input)
        );
        require(ecrecover(hash, v, r, s) == operator); // verification
        // convert r & s to uint256
        uint rand = uint256(r) << 128 | uint256(s) >> 128;
        
        ConsumerInterface(req.requestor).rawFulfillRandomWord(requestId, rand);
        req.state = RequestState.EXECUTED;
    }

    function findRequestToExecute() external view returns (uint256, Request memory) {
        for (uint256 i = 0; i < _nextRequestId; i++) {
            if(requests[i].state == RequestState.EXISTS) return (i, requests[i]);
        }
        return (0, Request(address(0), bytes32(0), RequestState.NONE));
    }

    function checkStatus(uint256 requestId) external view returns (RequestState) {
        return requests[requestId].state;
    }
    

    function requestRandomWord() external returns (uint256 requestId) {
        bytes32 input = blockhash(block.number - 1);
        requests[_nextRequestId] = Request(msg.sender, input, RequestState.EXISTS);
        emit RequestReceived(_nextRequestId, input);
        return _nextRequestId++;
    }
}