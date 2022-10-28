//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./IZKGroups.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import "@semaphore-protocol/contracts/base/SemaphoreCore.sol";
import "@semaphore-protocol/contracts/base/SemaphoreConstants.sol";

contract ZKGroups is IZKGroups, SemaphoreCore, Ownable {

    ISemaphore public semaphore;

    mapping(uint256 => OffchainGroup) public offchainGroups;
    mapping(uint256 => IVerifier) public verifiers;
    mapping(uint256 => bool) internal nullifierHashes;

    modifier onlySupportedMerkleTreeDepth(uint256 merkleTreeDepth) {
        if (address(verifiers[merkleTreeDepth]) == address(0)) {
            revert("MerkleTreeDepth is not supported");
        }
        _;
    }

    constructor(address semaphoreAddress, Verifier[] memory _verifiers) {
        semaphore = ISemaphore(semaphoreAddress);

        for (uint8 i = 0; i < _verifiers.length; ) {
            verifiers[_verifiers[i].merkleTreeDepth] = IVerifier(_verifiers[i].contractAddress);

            unchecked {
                ++i;
            }
        }
    }

    function updateOffchainGroup(OffchainGroup[] calldata _offchainGroups) external override onlyOwner {
        for (uint8 i = 0; i < _offchainGroups.length; i++){
            uint256 groupId = uint256(keccak256(abi.encodePacked("Offchain_",_offchainGroups[i].name))) % SNARK_SCALAR_FIELD;
            
            _updateOffchainGroup(groupId, _offchainGroups[i]);
        }
    }

    function verifyOffchainGroupProof(
        uint256 groupId,
        bytes32 signal,
        uint256 nullifierHash,
        uint256 externalNullifier,
        uint256[8] calldata proof
    ) external override {
        uint256 merkleTreeRoot = getOffchainRoot(groupId);
        uint256 depth = getOffchainDepth(groupId);

        require(depth != 0, "Offchain group does not exist");

        IVerifier verifier = verifiers[depth];

        _verifyProof(signal, merkleTreeRoot, nullifierHash, externalNullifier, proof, verifier);

        _saveNullifierHash(nullifierHash);

        emit ProofVerified(groupId, signal);
    }

    function getOffchainRoot(uint256 groupId) public view override returns (uint256) {
        return offchainGroups[groupId].merkleTreeRoot;
    }

    function getOffchainDepth(uint256 groupId) public view override returns (uint256) {
        return offchainGroups[groupId].merkleTreeDepth;
    }

    function _updateOffchainGroup(
        uint256 groupId,
        OffchainGroup calldata offchainGroup
    ) private onlySupportedMerkleTreeDepth(offchainGroup.merkleTreeDepth){
        offchainGroups[groupId] = offchainGroup;

        emit OffchainGroupUpdated(groupId, offchainGroup.name, offchainGroup.merkleTreeRoot, offchainGroup.merkleTreeDepth);
    }

    function _saveNullifierHash(uint256 nullifierHash) internal {
        nullifierHashes[nullifierHash] = true;
    }


    function creatOnchainGroup(
        uint256 groupId,
        uint256 depth,
        uint256 zeroValue,
        address admin,
        uint256 merkleTreeRootDuration
    ) external override {
        semaphore.createGroup(groupId, depth, zeroValue, admin, merkleTreeRootDuration);
    }

    function updateOnchainGroupAdmin(uint256 groupId, address newAdmin) external override {
        semaphore.updateGroupAdmin(groupId, newAdmin);
    }

    function addMember(uint256 groupId, uint256 identityCommitment) external override {
        semaphore.addMember(groupId, identityCommitment);
    }

    function addMembers(uint256 groupId, uint256[] calldata identityCommitments) external override {
        semaphore.addMembers(groupId, identityCommitments);
    }

    function updateMember(
        uint256 groupId,
        uint256 identityCommitment,
        uint256 newIdentityCommitment,
        uint256[] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) external override {
        semaphore.updateMember(groupId, identityCommitment, newIdentityCommitment, proofSiblings, proofPathIndices);
    }

    function removeMember(
        uint256 groupId,
        uint256 identityCommitment,
        uint256[] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) external override {
        semaphore.removeMember(groupId, identityCommitment, proofSiblings, proofPathIndices);
    }

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