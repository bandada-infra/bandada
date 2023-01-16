//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./IZKGroups.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@semaphore-protocol/contracts/interfaces/ISemaphoreVerifier.sol";

/// @title ZKGroups
/// @dev This contract is used to save the Merkle roots of the off-chain groups.
contract ZKGroups is IZKGroups, Ownable {
    ISemaphoreVerifier public verifier;

    /// @dev Gets a group name and returns the off-chain group data.
    mapping(bytes32 => GroupData) public groups;

    /// @dev Gets a group name and a nullifier hash and returns true if it has already been used.
    mapping(bytes32 => mapping(uint256 => bool)) internal nullifierHashes;

    /// @dev Initializes the Semaphore verifier used to verify the user's ZK proofs.
    /// @param _verifier: Semaphore verifier address.
    constructor(ISemaphoreVerifier _verifier) {
        verifier = _verifier;
    }

    /// @dev See {IZKGroups-updateGroups}.
    function updateGroups(bytes32[] calldata groupNames, GroupData[] calldata groupData) external override onlyOwner {
        if (groupNames.length != groupData.length) {
            revert ZKGroups__ParametersMustHaveTheSameLength();
        }

        for (uint256 i = 0; i < groupNames.length; ){
            _updateGroup(groupNames[i], groupData[i]);

            unchecked {
                ++i;
            }
        }
    }

    /// @dev See {IZKGroups-verifyProof}.
    function verifyProof(
        bytes32 groupName,
        uint256 signal,
        uint256 nullifierHash,
        uint256 externalNullifier,
        uint256[8] calldata proof
    ) external override {
        uint256 merkleTreeDepth = getMerkleTreeDepth(groupName);

        if (merkleTreeDepth == 0) {
            revert ZKGroups__GroupDoesNotExist();
        }

        if (nullifierHashes[groupName][nullifierHash]) {
            revert ZKGroups__YouAreUsingTheSameNullifierTwice();
        }

        uint256 merkleTreeRoot = getMerkleTreeRoot(groupName);

        verifier.verifyProof(merkleTreeRoot, nullifierHash, signal, externalNullifier, proof, merkleTreeDepth);

        nullifierHashes[groupName][nullifierHash] = true;

        emit ProofVerified(groupName, merkleTreeRoot, nullifierHash, externalNullifier, signal);
    }

    /// @dev See {IZKGroups-getMerkleTreeRoot}.
    function getMerkleTreeRoot(bytes32 groupName) public view override returns (uint256) {
        return groups[groupName].merkleTreeRoot;
    }

    /// @dev See {IZKGroups-getMerkleTreeDepth}.
    function getMerkleTreeDepth(bytes32 groupName) public view override returns (uint256) {
        return groups[groupName].merkleTreeDepth;
    }

    /// @dev Updates an off-chain group.
    /// @param groupName: Name of the off-chain group.
    /// @param groupData: Off-chain group data.
    function _updateGroup(
        bytes32 groupName,
        GroupData calldata groupData
    ) private {
        if (groupData.merkleTreeDepth < 16 || groupData.merkleTreeDepth > 32) {
            revert ZKGroups__MerkleTreeDepthIsNotSupported();
        }

        groups[groupName] = groupData;

        emit GroupUpdated(groupName, groupData.merkleTreeRoot, groupData.merkleTreeDepth);
    }
}
