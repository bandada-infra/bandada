export type MerkleProof = {
    root: any
    leaf: any
    siblings: any[]
    pathIndices: number[]
}

export type GroupType = "on-chain" | "off-chain"
