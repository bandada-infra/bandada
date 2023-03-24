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

export type ContractName = "Bandada" | "Semaphore" | "BandadaSemaphore"

export type OnchainBandadaGroup = {
    id: BigInt
    fingerprint: BigInt
}
