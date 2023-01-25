/* istanbul ignore file */
import { providers, Signer, Wallet } from "ethers"
import { getNetworkConfig } from "./networks";

export default async function getSigner(): Promise<Signer> {
    const network = getNetworkConfig();
    const provider = new providers.JsonRpcProvider(network.url)
    const accounts = await provider.listAccounts()

    if (accounts.length === 0) {
        if (!process.env["BACKEND_PRIVATE_KEY"]) {
            throw new Error("Please set your BACKEND_PRIVATE_KEY in a .env file")
        }

        return new Wallet(process.env["BACKEND_PRIVATE_KEY"], provider)
    }

    return provider.getSigner()
}
