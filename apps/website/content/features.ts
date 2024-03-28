export type Feature = {
    title: string
    description: string
    icon: string
}

export const FeatureItems: Feature[] = [
    {
        title: "Intuitive Group Creation",
        description:
            "Effortlessly create and manage both on-chain and off-chain anonymous groups with just a few clicks through our user-friendly admin dashboard.",
        icon: "/icons/feature-icon-1.svg"
    },
    {
        title: "Versatile Off-Chain Group",
        description:
            "Choose from a variety of off-chain group, including manual selection (applicable to on-chain groups as well), invitation-based, or credential-driven access.",
        icon: "/icons/feature-icon-2.svg"
    },
    {
        title: "Customizable Credential Requirements",
        description:
            "Tailor group membership by defining specific credentials from providers (e.g., GitHub, Twitter, Ethereum) that applicants must verify in order to join.",
        icon: "/icons/feature-icon-3.svg"
    },
    {
        title: "Powerful Application Development Support",
        description:
            "Bandada groups can be seen as a foundation for your applications, taking advantage of external protocol for adding of fully anonymous signaling.",
        icon: "/icons/feature-icon-4.svg"
    }
]
