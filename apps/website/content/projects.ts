export type ProjectLinkType = "website" | "github" | "discord"
export type Project = {
    name: string
    tagline: string
    description?: string
    pse?: boolean
    categories?: string[]
    links?: Partial<Record<ProjectLinkType, string>>
}

export const ProjectsSources = ["pse", "community"] as const
export const ProjectCategories = [
    "education",
    "social",
    "identity",
    "coordination",
    "autenticity",
    "nft",
    "trust",
    "iot",
    "ticketing",
    "interoperability",
    "data",
    "whistleblowing",
    "voting",
    "climate",
    "health",
    "infra"
] as const

export type ProjectCategory = (typeof ProjectCategories)[number]
export type ProjectSource = (typeof ProjectsSources)[number]

export const PROJECT_ITEMS: Project[] = [
    {
        name: "Project x",
        tagline:
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maxime asperiores illo, quas cum non saepe at inventore quod laborum nemo.",
        description: "Project description",
        pse: true,
        categories: ["climate", "nft", "iot"],
        links: {
            website: "https://example.com",
            discord: "https://discord.com"
        }
    },
    {
        name: "Project y",
        tagline:
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maxime asperiores illo, quas cum non saepe at inventore quod laborum nemo.",
        description: "Project description",
        pse: false,
        categories: ["infra", "nft"],
        links: {
            website: "https://example.com",
            discord: "https://discord.com"
        }
    },
    {
        name: "Project z",
        tagline:
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maxime asperiores illo, quas cum non saepe at inventore quod laborum nemo.",
        description: "Project description",
        pse: true,
        categories: ["data", "indentity"],
        links: {
            website: "https://example.com",
            discord: "https://discord.com"
        }
    },
    {
        name: "Project x",
        tagline:
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maxime asperiores illo, quas cum non saepe at inventore quod laborum nemo.",
        description: "Project description",
        pse: true,
        categories: ["climate", "nft", "iot"],
        links: {
            website: "https://example.com",
            discord: "https://discord.com"
        }
    },
    {
        name: "Project y",
        tagline:
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maxime asperiores illo, quas cum non saepe at inventore quod laborum nemo.",
        description: "Project description",
        pse: false,
        categories: ["infra", "nft"],
        links: {
            website: "https://example.com",
            discord: "https://discord.com"
        }
    },
    {
        name: "Project z",
        tagline:
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maxime asperiores illo, quas cum non saepe at inventore quod laborum nemo.",
        description: "Project description",
        pse: true,
        categories: ["data", "indentity"],
        links: {
            website: "https://example.com",
            discord: "https://discord.com",
            github: "https://github.com"
        }
    }
]
