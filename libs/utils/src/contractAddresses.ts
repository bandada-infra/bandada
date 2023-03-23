/* istanbul ignore file */

import { ContractName, Network } from "./types"

const CONTRACT_ADDRESSES: { [K in Network]: { [Y in ContractName]: string } } =
    {
        localhost: {
            Semaphore: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
            ZKGroups: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
            ZKGroupsSemaphore: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
        },
        goerli: {
            Semaphore: "0x89490c95eD199D980Cdb4FF8Bac9977EDb41A7E7",
            ZKGroups: "0x461C2f74F5adB6F3CE559A7f86F2872568DAB9B3",
            ZKGroupsSemaphore: "0xd81B417Ca0F6A74fBa86Ea17105d1863beE90bf4"
        }
    }

export function getContractAddresses(networkName: Network): {
    [Y in ContractName]: string
} {
    return CONTRACT_ADDRESSES[networkName]
}

export default CONTRACT_ADDRESSES
