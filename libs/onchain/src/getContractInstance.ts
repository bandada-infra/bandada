/* istanbul ignore file */
import ZKGroups from "contract-artifacts/ZKGroups.json"
import Semaphore from "contract-artifacts/Semaphore.json"
import { Contract } from "ethers"
import { getNetworkConfig } from "./networks";

export default function getContractInstance(contractName: string): Contract {
    const network = getNetworkConfig();

    switch (contractName) {
        case "ZKGroups":
            return new Contract(
                network.zkGroupsContract,
                ZKGroups.abi
            )
        case "Semaphore":
            return new Contract(
                network.semaphoreContract,
                Semaphore.abi
            )
        default:
            throw new TypeError(`${contractName} contract does not exist`)
    }
}
