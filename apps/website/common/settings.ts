import { MenuItem, SocialLink } from "@/types"
import { Icons } from "@/components/elements/Icons"

export const APP_SETTINGS = {
    APP_TITLE: "Bandada",
    APP_DESCRIPTION:
        "plug-and-play infrastructure that empowers anyone to create and manage privacy-preserving groups of anonymous individuals."
}

export const MENU_ITEMS: MenuItem[] = [
    {
        label: "Projects",
        href: "/projects"
    },
    {
        label: "Build",
        href: "/build"
    },
    {
        label: "Learn",
        href: "/learn"
    },
    {
        label: "Documentation",
        href: "https://docs.bandada.pse.dev/",
        external: true
    },
    {
        label: "Github",
        href: "https://github.com/bandada-infra/bandada",
        external: true
    },
    {
        label: "Design kit",
        href: "https://www.figma.com/file/8WLkTos9OQPp3MWx5w2gCJ/Bandada-Website?mode=dev",
        footerOnly: true,
        showInMobile: true,
        external: true
    }
]

export const LINKS: Record<string, string> = {
    GITHUB: "https://github.com/bandada-infra/bandada",
    WEBSITE_FEEDBACK:
        "https://github.com/orgs/bandada-infra/discussions/new?category=website",
    SUBMIT_PROJECT: "https://github.com/bandada-infra/bandada/issues/new",
    DISCORD: "https://discord.com/invite/sF5CT5rzrR",
    TWITTER: "https://twitter.com/BandadaDevs",
    GET_INSPIRED: "https://github.com/orgs/bandada-infra/discussions/367",
    LAUNCH_APP: "https://bandada.pse.dev/",
    GOOD_FIRST_ISSUES:
        "https://github.com/bandada-infra/bandada/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22"
}

export const SOCIAL_LINKS: SocialLink[] = [
    {
        label: "Discord",
        href: LINKS.DISCORD,
        icon: Icons.discord
    },
    {
        label: "Twitter",
        href: LINKS.TWITTER,
        icon: Icons.twitter
    }
]
