import { Network } from "./types"

type NetworkConfigParams = {
    url: string
    chainId: number
    semaphoreContract: string
    zkGroupsContract: string
}

const infuraApiKey = process.env.INFURA_API_KEY

const NETWORKS: { [K in Network]?: NetworkConfigParams } = {
    localhost: {
        url: "http://127.0.0.1:8545",
        chainId: 31337,
        semaphoreContract: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        zkGroupsContract: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    },
    goerli: {
        url: `https://goerli.infura.io/v3/${infuraApiKey}`,
        chainId: 5,
        semaphoreContract: "0x89490c95eD199D980Cdb4FF8Bac9977EDb41A7E7",
        zkGroupsContract: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
    },
    arbitrum: {
        url: "https://arb1.arbitrum.io/rpc",
        chainId: 42161,
        semaphoreContract: "",
        zkGroupsContract: ""
    }
}

export function getNetworkConfig(
    networkName = process.env.NX_DEFAULT_NETWORK as Network
) {
    if (networkName !== "localhost" && !process.env["INFURA_API_KEY"]) {
        throw new Error("Please set your INFURA_API_KEY in your .env file")
    }

    const network = NETWORKS[networkName]
    if (!network) {
        throw new Error(
            "'networkName' not provided or invalid value set for 'NX_DEFAULT_NETWORK' env variable"
        )
    }

    return network
}

export default NETWORKS
