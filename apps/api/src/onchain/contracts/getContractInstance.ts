/* istanbul ignore file */
import ZKGroups from "contract-artifacts/ZKGroups.json"
import { Contract } from "ethers"

export default function getContractInstance(contractName: string): Contract {
    switch (contractName) {
        case "ZKGroups":
            if (!process.env.ZKGROUPS_GOERLI_ADDRESS) {
                throw new Error(
                    "Please set your ZKGROUPS_GOERLI_ADDRESS in a .env file"
                )
            }
            return new Contract(
                process.env.ZKGROUPS_GOERLI_ADDRESS,
                ZKGroups.abi
            )
        default:
            throw new TypeError(`${contractName} contract does not exist`)
    }
}
