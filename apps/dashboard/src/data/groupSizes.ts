import { GroupSize } from "../types"

const groupSizes: GroupSize[] = [
    {
        name: "Small",
        description: "Communities and teams",
        capacity: "Up to 65k members",
        useCases: [
            "Donate to your community",
            "Give event feedback",
            "Prove demographic, criminal, or health information to an employer"
        ],
        treeDepth: 16
    },
    {
        name: "Medium",
        description: "Cities and companies",
        capacity: "Up to 1M members",
        useCases: [
            "Vote in your city's election",
            "Share feedback about work",
            "Prove professional certification",
            "Apply for grants/subsidies"
        ],
        treeDepth: 20
    },
    {
        name: "Large",
        description: "Cities, corporations, countries",
        capacity: "Up to 33M members",
        useCases: [
            "Participate in a census",
            "Vote in a national election",
            "Donate to a campaign"
        ],
        treeDepth: 25
    },
    {
        name: "XL",
        description: "Large countries or multiple nations",
        capacity: "Up to 1B members",
        useCases: [
            "Prove passport status",
            "Share health status with other countries",
            "Sponsor a cause"
        ],
        treeDepth: 30
    }
]

export default groupSizes
