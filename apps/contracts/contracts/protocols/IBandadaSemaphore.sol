//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/// @title IBandadaSemaphore contract interface.
interface IBandadaSemaphore {
    error BandadaSemaphore__YouAreUsingTheSameNullifierTwice();
    error BandadaSemaphore__MerkleTreeRootIsExpired();
    error BandadaSemaphore__MerkleTreeRootIsNotPartOfTheGroup();

    /// @dev Emitted when a Semaphore proof is correctly verified.
    /// @param groupId: Id of the group.
    /// @param merkleTreeRoot: Root of the Merkle tree.
    /// @param externalNullifier: External nullifier.
    /// @param nullifierHash: Nullifier hash.
    /// @param signal: Semaphore signal.
    event ProofVerified(
        uint256 indexed groupId,
        uint256 indexed merkleTreeRoot,
        uint256 indexed externalNullifier,
        uint256 nullifierHash,
        uint256 signal
    );

    /// @dev Saves the nullifier hash to avoid double signaling and emits an event
    /// if the zero-knowledge proof is valid.
    /// @param groupId: Id of the group.
    /// @param merkleTreeRoot: Merkle Tree Root of the group.
    /// @param merkleTreeDepth: Depth of the Merkle tree.
    /// @param signal: Semaphore signal.
    /// @param nullifierHash: Nullifier hash.
    /// @param externalNullifier: External nullifier.
    /// @param proof: Zero-knowledge proof.
    function verifyProof(
        uint256 groupId,
        uint256 merkleTreeRoot,
        uint256 merkleTreeDepth,
        uint256 signal,
        uint256 nullifierHash,
        uint256 externalNullifier,
        uint256[8] calldata proof
    ) external;
}
