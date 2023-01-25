/* istanbul ignore file */
import { JsonRpcProvider } from "@ethersproject/providers"
import { providers } from "ethers"
import { getNetworkConfig } from "./networks"
import { Network } from "./types"

export default function getProvider(networkName: Network): JsonRpcProvider {
    const network = getNetworkConfig(networkName)
    const provider = new providers.JsonRpcProvider(network.url)
    return provider
}
