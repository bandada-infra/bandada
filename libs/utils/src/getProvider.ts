/* istanbul ignore file */

import { ethers, type JsonRpcProvider } from "ethers"
import { Network } from "./types"

export default function getProvider(
    network: Network,
    apiKey?: string
): JsonRpcProvider {
    switch (network) {
        case "localhost":
            return new ethers.JsonRpcProvider("http://127.0.0.1:8545")
        case "sepolia":
            return new ethers.InfuraProvider(network, apiKey)
        default:
            throw new TypeError(`'${network}' network is not supported`)
    }
}
