export type Group = {
    id: string
    name: string
    description: string
    treeDepth: number
    members: string[]
    admin: string,
    apiEnabled?: boolean,
    apiKey?: string
}

export type Size = {
    sizeFor: string
    capacity: string
    useCases: string[]
    treeDepth: number
}

export const groupSizeInfo: Record<string, Size> = {
    small: {
        sizeFor: "For communities, small teams",
        capacity: "Capacity 30 thousand",
        useCases: ["voting", "feedback"],
        treeDepth: 16
    },
    medium: {
        sizeFor: "For cities, large teams",
        capacity: "Capacity 500 thousand",
        useCases: ["voting", "feedback"],
        treeDepth: 20
    },
    large: {
        sizeFor: "For nations",
        capacity: "Capacity 30 Million",
        useCases: ["voting", "feedback"],
        treeDepth: 25
    },
    xl: {
        sizeFor: "For multiple nations, contries",
        capacity: "Capacity 1 Billion",
        useCases: ["voting", "feedback"],
        treeDepth: 30
    }
}
