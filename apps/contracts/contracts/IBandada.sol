//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/// @title Bandada contract interface.
interface IBandada {
    struct Group {
        uint256 id;
        uint256 fingerprint;
    }

    /// @dev Emitted when an off-chain group is updated.
    /// @param id: Id of the off-chain group.
    /// @param fingerprint: Current fingerprint of the group.
    event GroupUpdated(uint256 indexed id, uint256 fingerprint);

    /// @dev Gets a group id and returns its current fingerprint.
    /// @param groupId: Id of the off-chain group.
    /// @return fingerprint: Current fingerprint of the group.
    function groups(uint256 groupId) external view returns (uint256);

    /// @dev Updates the off-chain groups.
    /// @param _groups: List of off-chain group data.
    function updateGroups(Group[] calldata _groups) external;

    /// @dev Updates the current fingerprints duration of the off-chain group.
    /// @param groupId: Id of the off-chain group.
    /// @param durationSeconds: Duration in seconds of fingerprints
    function updateFingerprintDuration(
        uint256 groupId,
        uint256 durationSeconds
    ) external;

    /// @dev Gets a group id and fingerprint and returns the fingerprint creation date.
    /// @param groupId: Id of the off-chain group.
    /// @param fingerprint: A fingerprint of the group.
    /// @return The fingerprint creation date.
    function getFingerprintCreationDate(
        uint256 groupId,
        uint256 fingerprint
    ) external view returns (uint256);

    /// @dev Gets a group id and returns its current fingerprint duration in seconds.
    /// @param groupId: Id of the off-chain group.
    /// @return Current fingerprint duration in seconds.
    function fingerprintDuration(
        uint256 groupId
    ) external view returns (uint256);
}
