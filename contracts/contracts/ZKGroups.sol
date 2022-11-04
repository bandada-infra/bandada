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
    mapping(uint256 => OffchainGroup) public offchainGroups;

    /// @dev Gets a group id and returns boolean about nullifierHashes used.
    mapping(uint256 => mapping(uint256 => bool)) internal nullifierHashes;

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
            uint256 groupId = uint256(keccak256(abi.encodePacked("Offchain_",_offchainGroups[i].name))) % SNARK_SCALAR_FIELD;
            
            _updateOffchainGroup(groupId, _offchainGroups[i]);

            unchecked {
                ++i;
            }
        }
    }

    /// @dev See {IZKGroups-verifyOffchainGroupProof}.
    function verifyOffchainGroupProof(
        uint256 groupId,
        bytes32 signal,
        uint256 nullifierHash,
        uint256 externalNullifier,
        uint256[8] calldata proof
    ) external override {
        uint256 merkleTreeRoot = getOffchainRoot(groupId);

        require(merkleTreeRoot != 0, "Offchain group does not exist");

        require(!nullifierHashes[groupId][nullifierHash], "you cannot use the same nullifier twice");

        uint256 merkleTreeDepth = getOffchainDepth(groupId);

        IVerifier verifier = verifiers[merkleTreeDepth];

        _verifyProof(signal, merkleTreeRoot, nullifierHash, externalNullifier, proof, verifier);

        _saveNullifierHash(groupId, nullifierHash);

        emit ProofVerified(groupId, nullifierHash, externalNullifier, signal);
    }

    /// @dev See {IZKGroups-getOffchainRoot}.
    function getOffchainRoot(uint256 groupId) public view override returns (uint256) {
        return offchainGroups[groupId].merkleTreeRoot;
    }

    /// @dev See {IZKGroups-getOffchainDepth}.
    function getOffchainDepth(uint256 groupId) public view override returns (uint256) {
        return offchainGroups[groupId].merkleTreeDepth;
    }

    /// @dev Updates an off-chain group.
    /// @param groupId: Id of the group.
    /// @param offchainGroup: off-chain group data.
    function _updateOffchainGroup(
        uint256 groupId,
        OffchainGroup calldata offchainGroup
    ) private onlySupportedMerkleTreeDepth(offchainGroup.merkleTreeDepth){
        offchainGroups[groupId] = offchainGroup;

        emit OffchainGroupUpdated(groupId, offchainGroup.name, offchainGroup.merkleTreeRoot, offchainGroup.merkleTreeDepth);
    }

    /// @dev Save nullifier hash to avoid double signaling.
    /// @param groupId: Id of the group.
    /// @param nullifierHash: Nullifier hash.
    function _saveNullifierHash(uint256 groupId, uint256 nullifierHash) internal {
        nullifierHashes[groupId][nullifierHash] = true;
    }
}