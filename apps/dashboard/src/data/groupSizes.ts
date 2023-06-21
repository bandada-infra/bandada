import { GroupSizes } from "../types"

const groupSizes: GroupSizes = {
    small: {
        description: "For communities, small teams",
        capacity: "Capacity 30 thousand",
        useCases: ["voting", "feedback"],
        treeDepth: 16
    },
    medium: {
        description: "For cities, large teams",
        capacity: "Capacity 500 thousand",
        useCases: ["voting", "feedback"],
        treeDepth: 20
    },
    large: {
        description: "For nations",
        capacity: "Capacity 30 Million",
        useCases: ["voting", "feedback"],
        treeDepth: 25
    },
    xl: {
        description: "For multiple nations, contries",
        capacity: "Capacity 1 Billion",
        useCases: ["voting", "feedback"],
        treeDepth: 30
    }
}

export default groupSizes
