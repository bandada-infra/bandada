import { Wallet } from "@ethersproject/wallet"
import getProvider from "./getProvider"
import { Network } from "./types"

export default function getWallet(
    privateKey: string,
    network?: Network
): Wallet {
    if (network) {
        const provider = getProvider(network)

        return new Wallet(privateKey, provider)
    }

    return new Wallet(privateKey)
}
