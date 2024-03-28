import { themes as prismThemes } from "prism-react-renderer"
import type { Config } from "@docusaurus/types"
import type * as Preset from "@docusaurus/preset-classic"

const config: Config = {
    title: "Bandada docs",
    tagline: "Bandada documentation",
    favicon: "img/favicon.ico",

    // Set the production url of your site here
    url: "https://docs.bandada.pse.dev",
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: "/",

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: "bandada-infra", // Usually your GitHub org/user name.
    projectName: "bandada", // Usually your repo name.

    onBrokenLinks: "warn",
    onBrokenMarkdownLinks: "warn",

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: "en",
        locales: ["en"]
    },

    presets: [
        [
            "classic",
            {
                docs: {
                    routeBasePath: "/",
                    sidebarPath: "./sidebars.ts",
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        "https://github.com/bandada-infra/bandada/edit/main/apps/docs"
                },
                blog: false,
                theme: {
                    customCss: "./src/css/custom.css"
                }
            } satisfies Preset.Options
        ]
    ],

    themeConfig: {
        // Social media card
        image: "img/social-media.png",
        colorMode: {
            defaultMode: "dark"
        },
        navbar: {
            title: "bandada",
            logo: {
                alt: "Bandada Logo",
                src: "img/logo.svg"
            },
            items: [
                {
                    href: "https://bandada.pse.dev",
                    label: "App",
                    position: "right"
                },
                {
                    href: "https://github.com/bandada-infra",
                    label: "GitHub",
                    position: "right"
                }
            ]
        },
        footer: {
            style: "dark",
            logo: {
                src: "img/logo-text.svg",
                width: 160,
                height: 51
            },
            links: [
                {
                    title: "Community",
                    items: [
                        {
                            label: "PSE Discord",
                            href: "https://discord.com/invite/sF5CT5rzrR"
                        },
                        {
                            label: "GitHub",
                            href: "https://github.com/bandada-infra/bandada"
                        },
                        {
                            label: "X (Twitter)",
                            href: "https://twitter.com/BandadaDevs"
                        }
                    ]
                },
                {
                    title: "Build",
                    items: [
                        {
                            label: "App",
                            href: "https://bandada.pse.dev"
                        },
                        {
                            label: "API",
                            href: "https://api.bandada.pse.dev"
                        },
                        {
                            label: "Boilerplate",
                            href: "https://github.com/bandada-infra/bandada-semaphore-demo"
                        },
                        {
                            label: "API SDK demo",
                            href: "https://github.com/bandada-infra/bandada-sdk-demo"
                        }
                    ]
                }
            ],
            copyright: `Copyright © ${new Date().getFullYear()} Ethereum Foundation`
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula
        }
    } satisfies Preset.ThemeConfig
}

export default config
