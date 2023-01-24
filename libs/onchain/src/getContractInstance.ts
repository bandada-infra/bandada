/* istanbul ignore file */
import ZKGroups from "contract-artifacts/ZKGroups.json"
import Semaphore from "contract-artifacts/Semaphore.json"
import { Contract } from "ethers"
import { ContractName } from "./types"

export default function getContractInstance(
    contractName: ContractName
): Contract {
    switch (contractName) {
        case "ZKGroups":
            if (!process.env["NX_ZKGROUPS_GOERLI_ADDRESS"]) {
                throw new Error(
                    "Please set your NX_ZKGROUPS_GOERLI_ADDRESS in a .env file"
                )
            }

            return new Contract(
                process.env["NX_ZKGROUPS_GOERLI_ADDRESS"],
                ZKGroups.abi
            )
        case "Semaphore":
            if (!process.env["NX_SEMAPHORE_GOERLI_ADDRESS"]) {
                throw new Error(
                    "Please set your NX_SEMAPHORE_GOERLI_ADDRESS in a .env file"
                )
            }

            return new Contract(
                process.env["NX_SEMAPHORE_GOERLI_ADDRESS"],
                Semaphore.abi
            )
        default:
            throw new TypeError(`'${contractName}' contract does not exist`)
    }
}
