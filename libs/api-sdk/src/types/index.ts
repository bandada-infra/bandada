export type Credential = {
    id: string
    criteria: Record<string, any>
}

export type Group = {
    id: string
    name: string
    description: string
    admin: string
    treeDepth: number
    fingerprint: string
    fingerprintDuration: number
    createdAt: Date
    members: string[]
    credentials: Credential | null
}

export type GroupCreationDetails = {
    name: string
    description: string
    treeDepth: number
    fingerprintDuration: number
    credentials?: Credential
}

export type GroupUpdateDetails = {
    description: string
    treeDepth: number
    fingerprintDuration: number
    credentials?: Credential
}

type GroupSummary = {
    id: string
    name: string
    description: string
    adminId: string
    treeDepth: number
    fingerprintDuration: number
    credentials: Credential | null
    createdAt: Date
    updatedAt: Date
}

export type InviteResponse = {
    code: string
    isRedeemed: boolean
    createdAt: Date
    group: GroupSummary
    groupName: string
    groupId: string
}

export enum SupportedUrl {
    DEV = "http://localhost:3000",
    PROD = "https://api.bandada.pse.dev",
    STAGING = "https://api-staging.bandada.pse.dev"
}
