//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./IZKGroups.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ZKGroups
/// @dev This contract is used to save the groups fingerprints.
contract ZKGroups is IZKGroups, Ownable {
    /// @dev See {IZKGroups-groups}.
    mapping(uint256 => uint256) public override groups;

    /// @dev See {IZKGroups-updateGroups}.
    function updateGroups(
        Group[] calldata _groups
    ) external override onlyOwner {
        for (uint256 i = 0; i < _groups.length; ) {
            groups[_groups[i].id] = _groups[i].fingerprint;

            emit GroupUpdated(_groups[i].id, _groups[i].fingerprint);

            unchecked {
                ++i;
            }
        }
    }
}
