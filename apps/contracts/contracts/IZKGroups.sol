//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/// @title ZKGroups contract interface.
interface IZKGroups {
    error ZKGroups__GroupDoesNotExist();
    error ZKGroups__YouAreUsingTheSameNullifierTwice();
    error ZKGroups__MerkleTreeDepthIsNotSupported();

    struct Group {
        uint256 merkleTreeRoot;
        uint256 merkleTreeDepth;
    }

    /// @dev Emitted when an off-chain group is updated.
    /// @param groupName: Name of the off-chain group.
    /// @param merkleTreeRoot: Root of the merkle tree.
    /// @param merkleTreeDepth: Depth of the merkle tree.
    event GroupUpdated(
        bytes32 indexed groupName,
        uint256 merkleTreeRoot,
        uint256 merkleTreeDepth
    );

    /// @dev Emitted when a Semaphore proof is correctly verified.
    /// @param groupName: Name of the off-chain group.
    /// @param merkleTreeRoot: Root of the Merkle tree.
    /// @param externalNullifier: External nullifier.
    /// @param nullifierHash: Nullifier hash.
    /// @param signal: Semaphore signal.
    event ProofVerified(
        bytes32 indexed groupName,
        uint256 merkleTreeRoot,
        uint256 externalNullifier,
        uint256 nullifierHash,
        uint256 signal
    );

    /// @dev Updates the off-chain groups.
    /// @param groupNames: List of off-chain group names.
    /// @param groups: List of off-chain group parameters.
    function updateGroups(bytes32[] calldata groupNames, Group[] calldata groups) external;

    /// @dev Saves the nullifier hash to avoid double signaling and emits an event
    /// if the zero-knowledge proof is valid.
    /// @param groupName: Name of the off-chain group.
    /// @param signal: Semaphore signal.
    /// @param nullifierHash: Nullifier hash.
    /// @param externalNullifier: External nullifier.
    /// @param proof: Zero-knowledge proof.
    function verifyProof(
            bytes32 groupName,
            uint256 signal,
            uint256 nullifierHash,
            uint256 externalNullifier,
            uint256[8] calldata proof
        ) external;

    /// @dev Returns the Merkle tree root of an off-chain group.
    /// @param groupName: Name of the off-chain group.
    /// @return merkleTreeRoot: Merkle tree root of the group.
    function getMerkleTreeRoot(bytes32 groupName) external view returns (uint256);

    /// @dev Returns the Merkle tree depth of an off-chain group.
    /// @param groupName: Name of the off-chain group.
    /// @return merkleTreeDepth: Merkle tree depth of the group.
    function getMerkleTreeDepth(bytes32 groupName) external view returns (uint256);
}
