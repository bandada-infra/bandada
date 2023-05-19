export type Group = {
    id: string
    name: string
    type?: string
    description?: string
    treeDepth: number
    members: string[]
    admin: string
    apiEnabled?: boolean
    apiKey?: string
}

export type GroupSize = {
    description: string
    capacity: string
    useCases: string[]
    treeDepth: number
}

export type GroupSizes = Record<string, GroupSize>

export default Group
