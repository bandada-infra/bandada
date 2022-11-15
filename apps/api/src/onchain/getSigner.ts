/* istanbul ignore file */
import { providers, Signer, Wallet } from "ethers"

export default async function getSigner(): Promise<Signer> {
    if (!process.env.INFURA_API_KEY) {
        throw new Error("Please set your INFURA_API_KEY in a .env file")
    }

    //defalt network: goerli
    const provider = new providers.JsonRpcProvider(
        `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`
    )
    const accounts = await provider.listAccounts()

    if (accounts.length === 0) {
        if (!process.env.BACKEND_PRIVATE_KEY) {
            throw new Error(
                "Please set your BACKEND_PRIVATE_KEY in a .env file"
            )
        }

        return new Wallet(process.env.BACKEND_PRIVATE_KEY, provider)
    }

    return provider.getSigner()
}
