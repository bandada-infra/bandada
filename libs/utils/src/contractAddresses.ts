/* istanbul ignore file */

import { ContractName, Network } from "./types"

const CONTRACT_ADDRESSES: { [K in Network]: { [Y in ContractName]: string } } =
    {
        localhost: {
            Semaphore: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
            ZKGroups: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
        },
        goerli: {
            Semaphore: "0x89490c95eD199D980Cdb4FF8Bac9977EDb41A7E7",
            ZKGroups: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
        }
    }

export function getContractAddresses(networkName: Network): {
    [Y in ContractName]: string
} {
    return CONTRACT_ADDRESSES[networkName]
}

export default CONTRACT_ADDRESSES
