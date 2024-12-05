/* istanbul ignore file */

import { ContractName, Network } from "./types"

const CONTRACT_ADDRESSES: { [K in Network]: { [Y in ContractName]: string } } =
    {
        localhost: {
            Semaphore: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
            Bandada: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
            BandadaSemaphore: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
        },
        sepolia: {
            Semaphore: "0x06d1530c829366A7fff0069e77c5af6A6FA7db2E",
            Bandada: "0xD2873C967079D8B1eAd9dc86B8F8f3948e29564E",
            BandadaSemaphore: "0x35ce7AFd20b031b4EEa83748D15f319Be9378d2C"
        }
    }

export function getContractAddresses(networkName: Network): {
    [Y in ContractName]: string
} {
    return CONTRACT_ADDRESSES[networkName]
}

export default CONTRACT_ADDRESSES
