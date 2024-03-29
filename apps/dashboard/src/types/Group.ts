export type Group = {
    id: string
    name: string
    type?: string
    description?: string
    treeDepth: number
    credentials?: string
    fingerprintDuration?: number
    members: string[]
    admin: string
    // apiEnabled?: boolean
    // apiKey?: string
    createdAt?: string
}

export type GroupSize = {
    name: string
    description: string
    capacity: string
    useCases: string[]
    treeDepth: number
}

export default Group
