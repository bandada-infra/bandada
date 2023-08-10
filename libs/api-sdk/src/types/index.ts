export type GroupResponse = {
    id: string
    name: string
    description: string
    admin: string
    treeDepth: number
    fingerprintDuration: number
    createdAt: Date
    members: string[]
    credentials: object
}

type Group = {
    id: string
    name: string
    description: string
    adminId: string
    treeDepth: number
    fingerprintDuration: number
    credentials: object
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
