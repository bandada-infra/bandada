/* istanbul ignore file */
import { JsonRpcProvider } from "ethers"
import { getNetworkConfig } from "./networks"
import { Network } from "./types"

export default function getProvider(networkName: Network): JsonRpcProvider {
    const network = getNetworkConfig(networkName)
    const provider = new JsonRpcProvider(network.url)
    return provider
}
