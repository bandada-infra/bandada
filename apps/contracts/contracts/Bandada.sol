//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {IBandada} from "./IBandada.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title Bandada
/// @dev This contract is used to save the groups fingerprints.
contract Bandada is IBandada, Ownable {
    /// @dev See {IBandada-groups}.
    mapping(uint256 => uint256) public override groups;

    mapping(uint256 => mapping(uint256 => uint256))
        public fingerprintCreationDates;

    /// @dev See {IBandada-fingerprintDuration}.
    mapping(uint256 => uint256) public override fingerprintDuration;

    /// @dev See {IBandada-updateGroups}.
    function updateGroups(
        Group[] calldata _groups
    ) external override onlyOwner {
        for (uint256 i = 0; i < _groups.length; ) {
            groups[_groups[i].id] = _groups[i].fingerprint;

            fingerprintCreationDates[_groups[i].id][
                _groups[i].fingerprint
            ] = block.timestamp;

            emit GroupUpdated(_groups[i].id, _groups[i].fingerprint);

            unchecked {
                ++i;
            }
        }
    }

    /// @dev See {IBandada-getFingerprintCreationDate}.
    function getFingerprintCreationDate(
        uint256 groupId,
        uint256 fingerprint
    ) external view override returns (uint256) {
        return fingerprintCreationDates[groupId][fingerprint];
    }

    /// @dev See {IBandada-updateFingerprintDuration}.
    function updateFingerprintDuration(
        uint256 groupId,
        uint256 durationSeconds
    ) external override onlyOwner {
        fingerprintDuration[groupId] = durationSeconds;
    }
}
