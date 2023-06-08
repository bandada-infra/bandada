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

    mapping(uint256 => uint256) public override fingerprintDuration;

    /// @dev See {IBandada-updateGroups}.
    function updateGroups(
        Group[] calldata _groups
    ) external override onlyOwner {
        for (uint256 i = 0; i < _groups.length; ) {
            groups[_groups[i].id] = _groups[i].fingerprint;

            fingerprintCreationDates[_groups[i].id][_groups[i].fingerprint] = block
            .timestamp;

            emit GroupUpdated(_groups[i].id, _groups[i].fingerprint);

            unchecked {
                ++i;
            }
        }
    }

    function getFingerprintCreationDate(
        uint256 groupId,
        uint256 fingerprint
    ) external view override onlyOwner returns (uint256) {
        return fingerprintCreationDates[groupId][fingerprint];
    }

    function updateFingerprintDuration(
        uint256 groupId,
        uint256 durationMinutes
    ) external override onlyOwner {
        fingerprintDuration[groupId] = durationMinutes;
    }
}
