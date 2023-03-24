//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {IBandadaSemaphore} from "./IBandadaSemaphore.sol";
import {IBandada} from "../IBandada.sol";
import {ISemaphoreVerifier} from "@semaphore-protocol/contracts/interfaces/ISemaphoreVerifier.sol";

/// @title BandadaSemaphore
/// @dev This contract is used to verify Semaphore proofs.
contract BandadaSemaphore is IBandadaSemaphore {
    ISemaphoreVerifier public verifier;
    IBandada public bandada;

    /// @dev Gets a group id and a nullifier hash and returns true if it has already been used.
    mapping(uint256 => mapping(uint256 => bool)) internal nullifierHashes;

    /// @dev Initializes the Semaphore verifier used to verify the user's ZK proofs.
    /// @param _verifier: Semaphore verifier address.
    /// @param _bandada: Bandada address.
    constructor(ISemaphoreVerifier _verifier, IBandada _bandada) {
        verifier = _verifier;
        bandada = _bandada;
    }

    /// @dev See {IBandadaSemaphore-verifyProof}.
    function verifyProof(
        uint256 groupId,
        uint256 merkleTreeDepth,
        uint256 signal,
        uint256 nullifierHash,
        uint256 externalNullifier,
        uint256[8] calldata proof
    ) external override {
        uint256 merkleTreeRoot = bandada.groups(groupId);

        if (nullifierHashes[groupId][nullifierHash]) {
            revert BandadaSemaphore__YouAreUsingTheSameNullifierTwice();
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
