//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./IZKGroups.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import "@semaphore-protocol/contracts/base/SemaphoreCore.sol";
import "@semaphore-protocol/contracts/base/SemaphoreConstants.sol";
import "@semaphore-protocol/contracts/interfaces/IVerifier.sol";

/// @title zk-groups
/// @dev Zk-groups is a semaphore group that implements both off-chain and on-chain.
/// zk-groups allow admins to create on-chain groups. Admins will be able to create
/// new on-chain groups with Metamask on Semaphore-supported networks. A Zk-groups contract
/// connected to the Semaphore.sol contract which is deployed, and it will also save
/// the Merkle tree roots of the other off-chain groups(i.e. reputation and permissioned groups),
/// which will then allow members of off-chain groups to verify their zero-knowledge proofs in that contract.
contract ZKGroups is IZKGroups, SemaphoreCore, Ownable {
    /// @dev semaphore interface for load deployed semaphore contract.
    ISemaphore public semaphore;

    /// @dev Gets a group id and returns the off-chain group parameters.
    mapping(uint256 => OffchainGroup) public offchainGroups;
    
    /// @dev Gets a merkle tree depth and returns its verifier address.
    mapping(uint256 => IVerifier) public verifiers;

    /// @dev Gets a group id and returns boolean about nullifierHashes used.
    mapping(uint256 => mapping(uint256 => bool)) internal nullifierHashes;

    /// @dev Gets a group id and returns the on-chain group admin.
    mapping(uint256 => address) public onchainGroupAdmin;

    /// @dev Checks if there is a verifier for the given merkle tree depth.
    /// @param merkleTreeDepth: Depth of the merkle tree.
    modifier onlySupportedMerkleTreeDepth(uint256 merkleTreeDepth) {
        if (address(verifiers[merkleTreeDepth]) == address(0)) {
            revert("MerkleTreeDepth is not supported");
        }
        _;
    }

    /// @dev Checks if the on-chain group admin is the transaction sender.
    /// @param groupId: Id of the group.
    modifier onlyOnchainGroupAdmin(uint256 groupId) {
        if (onchainGroupAdmin[groupId] != _msgSender()) {
            revert("Caller is not the onchain group admin");
        }
        _;
    }

    /// @dev Initializes the Semaphore and the Semaphore verifiers used to verify the user's ZK proofs.
    /// @param semaphoreAddress: deployed Semaphore contract address.
    /// @param _verifiers: List of Semaphore verifiers (address and related Merkle tree depth).
    constructor(address semaphoreAddress, Verifier[] memory _verifiers) {
        semaphore = ISemaphore(semaphoreAddress);

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

    /// @dev See {IZKGroups-createOnchainGroup}.
    function createOnchainGroup(
        uint256 groupId,
        uint256 merkleTreeDepth,
        uint256 zeroValue,
        address admin,
        uint256 merkleTreeRootDuration
    ) external override {
        semaphore.createGroup(groupId, merkleTreeDepth, zeroValue, address(this), merkleTreeRootDuration);
        onchainGroupAdmin[groupId] = admin;

        emit OnchainGroupAdminUpdated(groupId, address(0), admin);
    }

    /// @dev See {IZKGroups-updateOnchainGroupAdmin}.
    function updateOnchainGroupAdmin(uint256 groupId, address newAdmin) external override onlyOnchainGroupAdmin(groupId) {
        onchainGroupAdmin[groupId] = newAdmin;

        emit OnchainGroupAdminUpdated(groupId, _msgSender(), newAdmin);
    }

    /// @dev See {IZKGroups-addMember}.
    function addMember(uint256 groupId, uint256 identityCommitment) external override onlyOnchainGroupAdmin(groupId) {
        semaphore.addMember(groupId, identityCommitment);
    }

    /// @dev See {IZKGroups-addMembers}.
    function addMembers(uint256 groupId, uint256[] calldata identityCommitments) external override onlyOnchainGroupAdmin(groupId) {
        semaphore.addMembers(groupId, identityCommitments);
    }

    /// @dev See {IZKGroups-updateMember}.
    function updateMember(
        uint256 groupId,
        uint256 identityCommitment,
        uint256 newIdentityCommitment,
        uint256[] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) external override onlyOnchainGroupAdmin(groupId) {
        semaphore.updateMember(groupId, identityCommitment, newIdentityCommitment, proofSiblings, proofPathIndices);
    }

    /// @dev See {IZKGroups-removeMember}.
    function removeMember(
        uint256 groupId,
        uint256 identityCommitment,
        uint256[] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) external override onlyOnchainGroupAdmin(groupId) {
        semaphore.removeMember(groupId, identityCommitment, proofSiblings, proofPathIndices);
    }

    /// @dev See {IZKGroups-verifyOnchainGroupProof}.
    function verifyOnchainGroupProof(
        uint256 groupId,
        uint256 merkleTreeRoot,
        bytes32 signal,
        uint256 nullifierHash,
        uint256 externalNullifier,
        uint256[8] calldata proof
    ) external override {
        semaphore.verifyProof(groupId, merkleTreeRoot, signal, nullifierHash, externalNullifier, proof);
    }
}