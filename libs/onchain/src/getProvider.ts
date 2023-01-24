/* istanbul ignore file */
import { JsonRpcProvider } from "@ethersproject/providers"
import { providers } from "ethers"
import { Network } from "./types"

export default function getProvider(network: Network): JsonRpcProvider {
    switch (network) {
        case "localhost":
            return new JsonRpcProvider("http://127.0.0.1:8545/")

        default: {
            if (!process.env["INFURA_API_KEY"]) {
                throw new Error(
                    "Please set your INFURA_API_KEY in your .env file"
                )
            }

            return new providers.InfuraProvider(
                network,
                process.env["INFURA_API_KEY"]
            )
        }
    }
}
