import { ApiKeyActions } from "@bandada/utils"

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
    credentials: {
        id: string
        criteria: Record<string, any>
    }
}

export type GroupRequest = {
    name: string
    description: string
    treeDepth: number
    fingerprintDuration: number
    id?: string
    credentials?: {
        id: string
        criteria: Record<string, any>
    }
}

export type GroupUpdateRequest = {
    description: string
    treeDepth: number
    fingerprintDuration: number
    credentials?: {
        id: string
        criteria: Record<string, any>
    }
}

type Group = {
    id: string
    name: string
    description: string
    adminId: string
    treeDepth: number
    fingerprintDuration: number
    credentials: {
        id: string
        criteria: Record<string, any>
    }
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
