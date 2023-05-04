/* istanbul ignore file */

import { ContractName, Network } from "./types"

const CONTRACT_ADDRESSES: { [K in Network]: { [Y in ContractName]: string } } =
    {
        localhost: {
            Semaphore: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
            Bandada: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
            BandadaSemaphore: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
        },
        goerli: {
            Semaphore: "0x3889927F0B5Eb1a02C6E2C20b39a1Bd4EAd76131",
            Bandada: "0xB6f17dB678Dab765bC684Fd6BaA0F222Af388F77",
            BandadaSemaphore: "0xa0Bf12642C66Fc17d706D3FA7C9eB8EfAEA67d02"
        }
    }

export function getContractAddresses(networkName: Network): {
    [Y in ContractName]: string
} {
    return CONTRACT_ADDRESSES[networkName]
}

export default CONTRACT_ADDRESSES
