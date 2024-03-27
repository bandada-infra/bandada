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

/**
 * Defines the possible actions that can be performed on an API key.
 * This includes generating a new API key, enabling an existing API key,
 * and disabling an existing API key.
 */
export enum ApiKeyActions {
    Generate = "generate",
    Enable = "enable",
    Disable = "disable"
}
