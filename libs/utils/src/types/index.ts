// Supported networks: https://docs.ethers.org/v5/api/providers/api-providers/#InfuraProvider
export type Network =
    | "localhost"
    // | "homestead"
    | "goerli"
// | "sepolia"
// | "arbitrum"
// | "arbitrum-goerli"
// | "matic"
// | "maticmum"
// | "optimism"
// | "optimism-goerli"

export type ContractName = "ZKGroups" | "Semaphore" | "ZKGroupsSemaphore"

export type OnchainZKGroup = {
    id: BigInt
    fingerprint: BigInt
}
