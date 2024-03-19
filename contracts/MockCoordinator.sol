// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ConsumerInterface} from "./ConsumerInterface.sol";

contract MockCoordinator {

    struct Request {
        address requestor;
        bytes32 input;
        bool executed;
    }

    address public immutable operator;

    uint256 private _nextRequestId;
    mapping(uint256=>Request) private requests;

    event RequestReceived(uint256 requestId, bytes32 input);

    constructor(address _operator) {
        operator = _operator;
    }

    function execute(uint256 requestId, uint8 v, bytes32 r, bytes32 s) external {
        Request memory req = requests[requestId];
        require(!req.executed);
        require(ecrecover(req.input, v, r, s) == operator); // verification

        // convert r & s to uint256
        uint rand = uint256(r) << 128 | uint256(s) >> 128;
        
        ConsumerInterface(req.requestor).fulfillRandomWord(requestId, rand);
        req.executed = true;
    }

    function requestRandomWord() external returns (uint256 requestId) {
        bytes32 input = blockhash(block.number);
        requests[_nextRequestId] = Request(msg.sender, input, false);
        emit RequestReceived(_nextRequestId, input);
        return _nextRequestId++;
    }
}