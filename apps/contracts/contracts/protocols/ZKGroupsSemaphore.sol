//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {IZKGroupsSemaphore} from "./IZKGroupsSemaphore.sol";
import {IZKGroups} from "../IZKGroups.sol";
import {ISemaphoreVerifier} from "@semaphore-protocol/contracts/interfaces/ISemaphoreVerifier.sol";

/// @title ZKGroupsSemaphore
/// @dev This contract is used to verify Semaphore proofs.
contract ZKGroupsSemaphore is IZKGroupsSemaphore {
    ISemaphoreVerifier public verifier;
    IZKGroups public zkGroups;

    /// @dev Gets a group id and a nullifier hash and returns true if it has already been used.
    mapping(uint256 => mapping(uint256 => bool)) internal nullifierHashes;

    /// @dev Initializes the Semaphore verifier used to verify the user's ZK proofs.
    /// @param _verifier: Semaphore verifier address.
    /// @param _zkGroups: ZKGroups address.
    constructor(ISemaphoreVerifier _verifier, IZKGroups _zkGroups) {
        verifier = _verifier;
        zkGroups = _zkGroups;
    }

    /// @dev See {IZKGroupsSemaphore-verifyProof}.
    function verifyProof(
        uint256 groupId,
        uint256 merkleTreeDepth,
        uint256 signal,
        uint256 nullifierHash,
        uint256 externalNullifier,
        uint256[8] calldata proof
    ) external override {
        uint256 merkleTreeRoot = zkGroups.groups(groupId);

        if (nullifierHashes[groupId][nullifierHash]) {
            revert ZKGroupsSemaphore__YouAreUsingTheSameNullifierTwice();
        }

        verifier.verifyProof(
            merkleTreeRoot,
            nullifierHash,
            signal,
            externalNullifier,
            proof,
            merkleTreeDepth
        );

        nullifierHashes[groupId][nullifierHash] = true;

        emit ProofVerified(
            groupId,
            merkleTreeRoot,
            nullifierHash,
            externalNullifier,
            signal
        );
    }
}
