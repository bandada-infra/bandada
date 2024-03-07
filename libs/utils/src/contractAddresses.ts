/* istanbul ignore file */

import { ContractName, Network } from "./types"

const CONTRACT_ADDRESSES: { [K in Network]: { [Y in ContractName]: string } } =
    {
        localhost: {
            Semaphore: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
            Bandada: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
            BandadaSemaphore: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
        },
        sepolia: {
            Semaphore: "0x3889927F0B5Eb1a02C6E2C20b39a1Bd4EAd76131",
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
