/* istanbul ignore file */

import { ethers, type Wallet } from "ethers"
import getProvider from "./getProvider"
import { Network } from "./types"

export default function getWallet(
    privateKey: string,
    network?: Network,
    apiKey?: string
): Wallet {
    if (network) {
        const provider = getProvider(network, apiKey)

        return new ethers.Wallet(privateKey, provider)
    }

    return new ethers.Wallet(privateKey)
}
