//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/*
ZK-Groups will allow admins to also create on-chain groups.
Admins will be able to create new on-chain groups with Metamask on Semaphore-supported networks.
A ZK-Groups contract connected to the Semaphore.sol contract will be created,
and it will also save the Merkle roots of the other off-chain groups
(i.e. reputation and permissioned groups),
which will then allow members of off-chain groups to verify their zero-knowledge proofs in that contract.
*/

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

    event OffchainGroupUpdated(
        uint256 groupId,
        bytes32 indexed name,
        uint256 root,
        uint256 indexed depth
    );

    event ProofVerified(uint256 indexed groupId, bytes32 signal);


    function updateOffchainGroup(OffchainGroup[] calldata groups) external;

    function verifyOffchainGroupProof(
            uint256 groupId,
            bytes32 signal,
            uint256 nullifierHash,
            uint256 externalNullifier,
            uint256[8] calldata proof
        ) external;

    function getOffchainRoot(uint256 groupId) external view returns (uint256);

    function getOffchainDepth(uint256 groupId) external view returns (uint256);



    function creatOnchainGroup(
        uint256 groupId,
        uint256 depth,
        uint256 zeroValue,
        address admin,
        uint256 merkleTreeRootDuration
    ) external;

    function updateOnchainGroupAdmin(uint256 groupId, address newAdmin) external;

    function addMember(uint256 groupId, uint256 identityCommitment) external;

    function addMembers(uint256 groupId, uint256[] calldata identityCommitments) external;

    function updateMember(
        uint256 groupId,
        uint256 identityCommitment,
        uint256 newIdentityCommitment,
        uint256[] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) external;

    function removeMember(
        uint256 groupId,
        uint256 identityCommitment,
        uint256[] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) external;

    function verifyOnchainGroupProof(
        uint256 groupId,
        uint256 merkleTreeRoot,
        bytes32 signal,
        uint256 nullifierHash,
        uint256 externalNullifier,
        uint256[8] calldata proof
    ) external;
}