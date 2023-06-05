export type MerkleProof = {
    root: any
    leaf: any
    siblings: any[]
    pathIndices: number[]
}

export type OAuthProvider = "github" // | "twitter" | "reddit"

export type OAuthState = {
    groupId: string
    memberId: string
    provider: OAuthProvider
}
