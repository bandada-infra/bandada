import { EASProvider, EASNetworks } from "../.."
import queryGraph from "../../queryGraph"

// Graph endpoint for ethereum mainnet.
const easDefaultEndpoint = `https://easscan.org/graphql`
const easNetworkEndpoint = (network: EASNetworks) =>
    `https://${network}.easscan.org/graphql`

const provider: EASProvider = {
    name: "eas",

    async queryGraph(network: EASNetworks, query: string) {
        return queryGraph(
            network === EASNetworks.ETHEREUM
                ? easDefaultEndpoint
                : easNetworkEndpoint(network),
            query
        )
    }
}

export default provider
