//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/// @title zk-groups interface.
/// @dev Interface of a ZKGroups contract.
interface IZKGroups {
    struct Verifier {
        address contractAddress;
        uint256 merkleTreeDepth;
    }

    struct OffchainGroup {
        bytes32 name;
        uint256 merkleTreeRoot;
        uint256 merkleTreeDepth;
    }

    /// @dev Emitted when an off-chain group is updated.
    /// @param groupId: Id of the group.
    /// @param name: Name of the off-chain group.
    /// @param merkleTreeRoot: Root of the merkle tree.
    /// @param merkleTreeDepth: Depth of the merkle tree.
    event OffchainGroupUpdated(
        uint256 groupId,
        bytes32 indexed name,
        uint256 merkleTreeRoot,
        uint256 indexed merkleTreeDepth
    );

    /// @dev Emitted when a Semaphore proof is verified.
    /// @param groupId: Id of the group.
    /// @param externalNullifier: External nullifier.
    /// @param nullifierHash: Nullifier hash.
    /// @param signal: Semaphore signal.
    event ProofVerified(
        uint256 indexed groupId,
        uint256 externalNullifier,
        uint256 nullifierHash,
        bytes32 signal
    );

    /// @dev Updates the off-chain groups.
    /// @param groups: List of off-chain groups.
    function updateOffchainGroups(OffchainGroup[] calldata groups) external;

    /// @dev Saves the nullifier hash to avoid double signaling and emits an event
    /// if the zero-knowledge proof is valid. This is for off-chain group.
    /// @param groupId: Id of the group.
    /// @param signal: Semaphore signal.
    /// @param nullifierHash: Nullifier hash.
    /// @param externalNullifier: External nullifier.
    /// @param proof: Zero-knowledge proof.
    function verifyOffchainGroupProof(
            uint256 groupId,
            bytes32 signal,
            uint256 nullifierHash,
            uint256 externalNullifier,
            uint256[8] calldata proof
        ) external;

    /// @dev Returns the merkle tree root of an off-chain group.
    /// @param groupId: Id of the group.
    /// @return merkleTreeRoot: merkle tree root of the group.
    function getOffchainRoot(uint256 groupId) external view returns (uint256);

    /// @dev Returns the merkle tree depth of an off-chain group.
    /// @param groupId: Id of the group.
    /// @return merkleTreeDepth: merkle tree Depth of the group.
    function getOffchainDepth(uint256 groupId) external view returns (uint256);
}