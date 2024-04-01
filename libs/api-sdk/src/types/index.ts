export type Credential = {
    id: string
    criteria: Record<string, any>
}

export type GroupResponse = {
    id: string
    name: string
    description: string
    admin: string
    treeDepth: number
    fingerprint: string
    fingerprintDuration: number
    createdAt: Date
    members: string[]
    credentials: Credential
}

export type GroupRequest = {
    name: string
    description: string
    treeDepth: number
    fingerprintDuration: number
    credentials?: Credential
}

export type GroupUpdateRequest = {
    description: string
    treeDepth: number
    fingerprintDuration: number
    credentials?: Credential
}

type Group = {
    id: string
    name: string
    description: string
    adminId: string
    treeDepth: number
    fingerprintDuration: number
    credentials: Credential
    apiEnabled: boolean
    apiKey: string
    createdAt: Date
    updatedAt: Date
}

export type InviteResponse = {
    code: string
    isRedeemed: boolean
    createdAt: Date
    group: Group
    groupName: string
    groupId: string
}

export enum SupportedUrl {
    DEV = "http://localhost:3000",
    PROD = "https://api.bandada.pse.dev",
    STAGING = "https://api-staging.bandada.pse.dev"
}
