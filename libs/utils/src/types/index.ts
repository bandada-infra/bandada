// Supported networks: https://docs.ethers.org/v5/api/providers/api-providers/#InfuraProvider
export type Network = "localhost" | "sepolia"

export type ContractName = "Bandada" | "Semaphore" | "BandadaSemaphore"

export type OnchainBandadaGroup = {
    id: BigInt
    fingerprint: BigInt
}

export type BlockchainNetwork = {
    id: string
    name: string
}
