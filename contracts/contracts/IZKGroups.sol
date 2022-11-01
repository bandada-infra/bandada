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

    /// @dev Emitted when an admin is assigned to a on-chain group.
    /// @param groupId: Id of the group.
    /// @param oldAdmin: Old admin of the on-chain group.
    /// @param newAdmin: New admin of the on-chain group.
    event OnchainGroupAdminUpdated(
        uint256 indexed groupId,
        address indexed oldAdmin,
        address indexed newAdmin
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


    /// @dev Creates a new on-chain group. Only the admin will be able to add or remove members.
    /// On-chain groups are managed in the deployed semaphore contract.
    /// @param groupId: Id of the group.
    /// @param merkleTreeDepth: merkle tree Depth of the group.
    /// @param zeroValue: Zero value of the merkle tree.
    /// @param admin: Admin of the group.
    /// @param merkleTreeRootDuration: Time before the validity of a merkle tree root expires.
    function createOnchainGroup(
        uint256 groupId,
        uint256 merkleTreeDepth,
        uint256 zeroValue,
        address admin,
        uint256 merkleTreeRootDuration
    ) external;

    /// @dev Updates the on-chain group admin.
    /// @param groupId: Id of the group.
    /// @param newAdmin: New admin of the group.
    function updateOnchainGroupAdmin(uint256 groupId, address newAdmin) external;

    /// @dev Adds a new member to an existing on-chain group.
    /// On-chain groups are managed in the deployed semaphore contract.
    /// @param groupId: Id of the group.
    /// @param identityCommitment: New identity commitment.
    function addMember(uint256 groupId, uint256 identityCommitment) external;

    /// @dev Adds new members to an existing on-chain group.
    /// @param groupId: Id of the group.
    /// @param identityCommitments: New identity commitments.
    function addMembers(uint256 groupId, uint256[] calldata identityCommitments) external;

    /// @dev Updates an identity commitment of an existing on-chain group. A proof of membership is
    /// needed to check if the node to be updated is part of the merkle tree.
    /// On-chain groups are managed in the deployed semaphore contract.
    /// @param groupId: Id of the group.
    /// @param identityCommitment: Existing identity commitment to be updated.
    /// @param newIdentityCommitment: New identity commitment.
    /// @param proofSiblings: Array of the sibling nodes of the proof of membership.
    /// @param proofPathIndices: Path of the proof of membership.
    function updateMember(
        uint256 groupId,
        uint256 identityCommitment,
        uint256 newIdentityCommitment,
        uint256[] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) external;

    /// @dev Removes a member from an existing on-chain group. A proof of membership is
    /// needed to check if the node to be removed is part of the merkle tree.
    /// On-chain groups are managed in the deployed semaphore contract.
    /// @param groupId: Id of the group.
    /// @param identityCommitment: Identity commitment to be removed.
    /// @param proofSiblings: Array of the sibling nodes of the proof of membership.
    /// @param proofPathIndices: Path of the proof of membership.
    function removeMember(
        uint256 groupId,
        uint256 identityCommitment,
        uint256[] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) external;

    /// @dev Saves the nullifier hash to avoid double signaling and emits an event
    /// if the zero-knowledge proof is valid. This is for on-chain group.
    /// nullifier hash and event happens in the deployed semaphore contract.
    /// @param groupId: Id of the group.
    /// @param signal: Semaphore signal.
    /// @param nullifierHash: Nullifier hash.
    /// @param externalNullifier: External nullifier.
    /// @param proof: Zero-knowledge proof.
    function verifyOnchainGroupProof(
        uint256 groupId,
        uint256 merkleTreeRoot,
        bytes32 signal,
        uint256 nullifierHash,
        uint256 externalNullifier,
        uint256[8] calldata proof
    ) external;
}