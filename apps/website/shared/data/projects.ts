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
export type ProjectSource = (typeof ProjectsSources)[number]

export const PROJECT_ITEMS: Project[] = [
    {
        name: "p0tion",
        tagline: "Toolkit for Groth16 Phase 2 Trusted Setup ceremonies",
        pse: true,
        categories: ["anti-sybil", "trusted setup", "demo"],
        links: {
            website: "https://pse.dev/en/projects/p0tion",
            github: "https://github.com/privacy-scaling-explorations/p0tion"
        }
    },
    {
        name: "Discreetly",
        tagline: "An anonymous, federated, chat application using ZK",
        pse: true,
        categories: ["chat", "private", "anonymous"],
        links: {
            website: "https://app.discreetly.chat/",
            github: "https://github.com/Discreetly"
        }
    },
    {
        name: "0x2FA",
        tagline: "Privacy Preserving 2FA W/ A Novel Multisig",
        pse: false,
        categories: ["multisig", "privacy", "security"],
        links: {
            website:
                "https://taikai.network/cryptocanal/hackathons/ethdam2024/projects/cluz0xnnj013uz301nfa9uj4g/idea",
            github: "https://github.com/0x2fa-org/0x2fa"
        }
    },
    {
        name: "BrickWall",
        tagline: "Web3 company reviews platform with privacy-preserving groups",
        pse: false,
        categories: ["review", "feedback", "privacy"],
        links: {
            website:
                "https://taikai.network/cryptocanal/hackathons/ethdam2024/projects/clux971fz00nuvq01mh9g5phl/idea"
        }
    },
    {
        name: "B-Hook",
        tagline:
            "Create content, get community feedback and build innovative NFT-backed privacy",
        pse: false,
        categories: ["feedback", "nft", "privacy", "community"],
        links: {
            website:
                "https://taikai.network/cryptocanal/hackathons/ethdam2024/projects/cluz8gb2701a9z301ptjuvhlo/idea"
        }
    }
]
