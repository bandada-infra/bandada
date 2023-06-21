import { BigNumber, utils } from "ethers"

/**
 * It converts a group name as a big number to a string.
 * @param groupNameBN The group name as a big number.
 * @returns The group name string.
 */
export default function parseGroupName(groupNameBN: string) {
    try {
        return utils.parseBytes32String(
            BigNumber.from(groupNameBN).toHexString()
        )
    } catch (error) {
        // If not parse-able as a string, it returns the original value.
        return groupNameBN
    }
}
