export type Build = {
    title: string
    href: string
    content: {
        title: string
        items: string[]
    }
    icon: string
}

export const BuildItems: Build[] = [
    {
        title: "API",
        icon: "/icons/build-icon-1.svg",
        href: "https://github.com/bandada-infra/bandada-semaphore-demo",
        content: {
            title: "Functions to facilitate integration:",
            items: [
                "Easy to use JavaScript package that wraps up API calls",
                "Create and manage groups in seconds. Generate proofs in one command",
                "Try the bandada-semaphore-demo"
            ]
        }
    },
    {
        title: "SDK",
        icon: "/icons/build-icon-2.svg",
        href: "https://api.bandada.pse.dev/",
        content: {
            title: "Directly interact with Bandada instance:",
            items: [
                "Use any programming language",
                "Build logic on top of API calls",
                "Try out"
            ]
        }
    },
    {
        title: "Boilerplate",
        icon: "/icons/build-icon-3.svg",
        href: "https://www.figma.com/exit?url=https%3A%2F%2Fgithub.com%2Fbandada-infra%2Fbandada-semaphore-demo",
        content: {
            title: "Start from template:",
            items: [
                "Begin your projects with a ready-to-use example template",
                "Create identity, join group, send anonymous feedback",
                "Easily modify to align with specific project goals"
            ]
        }
    }
]
