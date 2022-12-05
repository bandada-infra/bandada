/* istanbul ignore file */
import ZKGroups from "contract-artifacts/ZKGroups.json"
import Semaphore from "contract-artifacts/Semaphore.json"
import { Contract } from "ethers"

export default function getContractInstance(contractName: string): Contract {
    switch (contractName) {
        case "ZKGroups":
            if (!process.env["ZKGROUPS_GOERLI_ADDRESS"]) {
                throw new Error(
                    "Please set your ZKGROUPS_GOERLI_ADDRESS in a .env file"
                )
            }
            return new Contract(
                process.env["ZKGROUPS_GOERLI_ADDRESS"],
                ZKGroups.abi
            )
        case "Semaphore":
            return new Contract(
                "0x5259d32659F1806ccAfcE593ED5a89eBAb85262f",
                Semaphore.abi
            )
        default:
            throw new TypeError(`${contractName} contract does not exist`)
    }
}
