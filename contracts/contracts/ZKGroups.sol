//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./IZKGroups.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@semaphore-protocol/contracts/base/SemaphoreCore.sol";
import "@semaphore-protocol/contracts/base/SemaphoreConstants.sol";
import "@semaphore-protocol/contracts/interfaces/IVerifier.sol";

/// @title zk-groups
/// @dev Zk-groups is a semaphore group infrastructure that can create both off-chain and on-chain groups.
/// zk-groups dashboard allow admins to create on-chain groups by directly connect to official Semaphore contract.
/// A Zk-groups contract save the Merkle tree roots of the other off-chain groups(i.e. reputation and permissioned groups),
/// which will then allow members of off-chain groups to verify their zero-knowledge proofs in that contract.
contract ZKGroups is IZKGroups, SemaphoreCore, Ownable {
    /// @dev Gets a merkle tree depth and returns its verifier address.
    mapping(uint256 => IVerifier) public verifiers;

    /// @dev Gets a group id and returns the off-chain group parameters.
    mapping(bytes32 => OffchainGroup) public offchainGroups;

    /// @dev Gets a group id and returns boolean about nullifierHashes used.
    mapping(bytes32 => mapping(uint256 => bool)) internal nullifierHashes;

    /// @dev Checks if there is a verifier for the given merkle tree depth.
    /// @param merkleTreeDepth: Depth of the merkle tree.
    modifier onlySupportedMerkleTreeDepth(uint256 merkleTreeDepth) {
        if (address(verifiers[merkleTreeDepth]) == address(0)) {
            revert("MerkleTreeDepth is not supported");
        }
        _;
    }

    /// @dev Initializes the Semaphore verifiers used to verify the user's ZK proofs.
    /// @param _verifiers: List of Semaphore verifiers (address and related Merkle tree depth).
    constructor(Verifier[] memory _verifiers) {
        for (uint8 i = 0; i < _verifiers.length; ) {
            verifiers[_verifiers[i].merkleTreeDepth] = IVerifier(_verifiers[i].contractAddress);

            unchecked {
                ++i;
            }
        }
    }

    /// @dev See {IZKGroups-updateOffchainGroups}.
    function updateOffchainGroups(OffchainGroup[] calldata _offchainGroups) external override onlyOwner {
        for (uint8 i = 0; i < _offchainGroups.length; ){
            _updateOffchainGroup(_offchainGroups[i].groupName, _offchainGroups[i]);

            unchecked {
                ++i;
            }
        }
    }

    /// @dev See {IZKGroups-verifyOffchainGroupProof}.
    function verifyOffchainGroupProof(
        bytes32 groupName,
        bytes32 signal,
        uint256 nullifierHash,
        uint256 externalNullifier,
        uint256[8] calldata proof
    ) external override {
        uint256 merkleTreeRoot = getOffchainRoot(groupName);

        require(merkleTreeRoot != 0, "Offchain group does not exist");

        require(!nullifierHashes[groupName][nullifierHash], "you cannot use the same nullifier twice");

        uint256 merkleTreeDepth = getOffchainDepth(groupName);

        IVerifier verifier = verifiers[merkleTreeDepth];

        _verifyProof(signal, merkleTreeRoot, nullifierHash, externalNullifier, proof, verifier);

        _saveNullifierHash(groupName, nullifierHash);

        emit ProofVerified(groupName, nullifierHash, externalNullifier, signal);
    }

    /// @dev See {IZKGroups-getOffchainRoot}.
    function getOffchainRoot(bytes32 groupName) public view override returns (uint256) {
        return offchainGroups[groupName].merkleTreeRoot;
    }

    /// @dev See {IZKGroups-getOffchainDepth}.
    function getOffchainDepth(bytes32 groupName) public view override returns (uint256) {
        return offchainGroups[groupName].merkleTreeDepth;
    }

    /// @dev Updates an off-chain group.
    /// @param groupName: Name of the off-chain group.
    /// @param offchainGroup: off-chain group data.
    function _updateOffchainGroup(
        bytes32 groupName,
        OffchainGroup calldata offchainGroup
    ) private onlySupportedMerkleTreeDepth(offchainGroup.merkleTreeDepth){
        offchainGroups[groupName] = offchainGroup;

        emit OffchainGroupUpdated(offchainGroup.groupName, offchainGroup.merkleTreeRoot, offchainGroup.merkleTreeDepth);
    }

    /// @dev Save nullifier hash to avoid double signaling.
    /// @param groupName: Name of the off-chain group.
    /// @param nullifierHash: Nullifier hash.
    function _saveNullifierHash(bytes32 groupName, uint256 nullifierHash) internal {
        nullifierHashes[groupName][nullifierHash] = true;
    }
}