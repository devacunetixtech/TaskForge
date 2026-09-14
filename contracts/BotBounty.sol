// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract BotBounty is ReentrancyGuard {
    enum Status { Open, Awarded, Cancelled }

    struct Bounty {
        address payable creator;
        uint256 reward;
        uint64 deadline;
        Status status;
        string title;
        string description;
    }

    struct Submission {
        address payable solver;
        string description;
        string solutionUrl;
        uint64 createdAt;
    }

    uint256 public nextBountyId;
    mapping(uint256 => Bounty) public bounties;
    mapping(uint256 => Submission[]) private submissions;

    event BountyCreated(uint256 indexed bountyId, address indexed creator, uint256 reward, uint64 deadline, string title);
    event SubmissionCreated(uint256 indexed bountyId, uint256 indexed submissionId, address indexed solver);
    event BountyAwarded(uint256 indexed bountyId, uint256 indexed submissionId, address indexed winner, uint256 reward);
    event BountyCancelled(uint256 indexed bountyId, uint256 refund);

    error InvalidDeadline();
    error EmptyTitle();
    error EmptySubmission();
    error NotCreator();
    error NotOpen();
    error DeadlinePassed();
    error DeadlineNotReached();
    error InvalidSubmission();
    error TransferFailed();

    function createBounty(string calldata title, string calldata description, uint64 deadline) external payable returns (uint256 bountyId) {
        if (bytes(title).length == 0) revert EmptyTitle();
        if (deadline <= block.timestamp) revert InvalidDeadline();
        if (msg.value == 0) revert TransferFailed();
        bountyId = nextBountyId++;
        bounties[bountyId] = Bounty(payable(msg.sender), msg.value, deadline, Status.Open, title, description);
        emit BountyCreated(bountyId, msg.sender, msg.value, deadline, title);
    }

    function submitSolution(uint256 bountyId, string calldata description, string calldata solutionUrl) external {
        Bounty storage bounty = bounties[bountyId];
        if (bounty.creator == address(0)) revert NotOpen();
        if (bounty.status != Status.Open) revert NotOpen();
        if (block.timestamp >= bounty.deadline) revert DeadlinePassed();
        if (bytes(description).length == 0) revert EmptySubmission();
        submissions[bountyId].push(Submission(payable(msg.sender), description, solutionUrl, uint64(block.timestamp)));
        emit SubmissionCreated(bountyId, submissions[bountyId].length - 1, msg.sender);
    }

    function approveSubmission(uint256 bountyId, uint256 submissionId) external nonReentrant {
        Bounty storage bounty = bounties[bountyId];
        if (msg.sender != bounty.creator) revert NotCreator();
        if (bounty.status != Status.Open) revert NotOpen();
        if (submissionId >= submissions[bountyId].length) revert InvalidSubmission();
        Submission memory submission = submissions[bountyId][submissionId];
        bounty.status = Status.Awarded;
        (bool sent,) = submission.solver.call{value: bounty.reward}("");
        if (!sent) revert TransferFailed();
        emit BountyAwarded(bountyId, submissionId, submission.solver, bounty.reward);
    }

    function cancelExpiredBounty(uint256 bountyId) external nonReentrant {
        Bounty storage bounty = bounties[bountyId];
        if (msg.sender != bounty.creator) revert NotCreator();
        if (bounty.status != Status.Open) revert NotOpen();
        if (block.timestamp < bounty.deadline) revert DeadlineNotReached();
        bounty.status = Status.Cancelled;
        (bool sent,) = bounty.creator.call{value: bounty.reward}("");
        if (!sent) revert TransferFailed();
        emit BountyCancelled(bountyId, bounty.reward);
    }

    function getSubmissions(uint256 bountyId) external view returns (Submission[] memory) { return submissions[bountyId]; }
}
