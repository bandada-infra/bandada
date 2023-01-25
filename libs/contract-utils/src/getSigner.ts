/* istanbul ignore file */
import { Signer, Wallet } from "ethers"
import getProvider from "./getProvider"
import { Network } from "./types"

export default async function getSigner(network: Network): Promise<Signer> {
    if (!process.env["BACKEND_PRIVATE_KEY"]) {
        throw new Error("Please set your INFURA_API_KEY in your .env file")
    }

    const provider = getProvider(network)

    // TODO: move ethers from an Hardhat account to the backend account.
    return new Wallet(process.env["BACKEND_PRIVATE_KEY"], provider)
}
