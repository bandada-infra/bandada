export type MerkleProof = {
    root: any
    leaf: any
    siblings: any[]
    pathIndices: number[]
}

export enum GroupType {
    ONCHAIN = "on-chain",
    OFFCHAIN = "off-chain"
}
