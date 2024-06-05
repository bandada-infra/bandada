import { LINKS } from "@/common/settings"

export const BUILD_PAGE_LABELS = {
    TITLE: "Let's build something new",
    SUBTITLE:
        "Jumpstart your app development process with these building tools.",
    CONTRIBUTE: {
        TITLE: "Contribute to Bandada",
        DESCRIPTION:
            "Bandada is open source with dozens of community contributors. You can propose improvements to the protocol or take good first issues to get started.",
        LINKS: [
            {
                label: "Good first issues",
                href: LINKS.GOOD_FIRST_ISSUES
            },
            {
                label: "Enhance the protocol",
                href: LINKS.GITHUB
            },
            {
                label: "Give feedback about the website",
                href: LINKS.WEBSITE_FEEDBACK
            }
        ]
    }
}
