import Image from "next/image"
import { classed } from "@tw-classed/react"
import { LINKS, MENU_ITEMS, SOCIAL_LINKS } from "@/common/settings"
import { Icons } from "./elements/Icons"
import { Label } from "./elements/Label"
import { Divider } from "./elements/Divider"
import { AppContainer } from "./AppContainer"
import { LABELS } from "@/shared/labels"
import { AppLink } from "./AppLink"

const MenuWrapper = classed.div(
    "flex flex-col items-center md:items-start gap-6 md:flex-row flex-wrap"
)

function AppFooter() {
    return (
        <div className="bg-baltic-sea-950">
            <AppContainer className="flex flex-col gap-12 pt-20 pb-12">
                <div className="mx-auto md:ml-0">
                    <Image
                        src="/icons/bandada-logo-small.svg"
                        width={144}
                        height={144}
                        alt="bandada logo small"
                    />
                </div>
                <div className="flex">
                    <div className="flex flex-col gap-12 mg:gap-0 md:flex-row w-full md:justify-between">
                        <MenuWrapper>
                            {MENU_ITEMS.map(
                                ({ label, href, external }, index) => (
                                    <AppLink
                                        href={href}
                                        key={index}
                                        external={external}
                                    >
                                        <Label.MenuItem className="flex items-center hover:text-classic-rose-500 duration-300">
                                            {label}

                                            {external && (
                                                <Icons.ExternalLink size={20} />
                                            )}
                                        </Label.MenuItem>
                                    </AppLink>
                                )
                            )}
                        </MenuWrapper>
                        <MenuWrapper>
                            {SOCIAL_LINKS.map(
                                ({ label, href, icon }, index) => {
                                    const Icon: any = icon
                                    return (
                                        <AppLink
                                            key={index}
                                            href={href}
                                            external
                                        >
                                            <Label.MenuItem
                                                key={index}
                                                className="flex items-center hover:text-classic-rose-500 duration-300"
                                            >
                                                <Icon />
                                                <span>{label}</span>
                                            </Label.MenuItem>
                                        </AppLink>
                                    )
                                }
                            )}
                        </MenuWrapper>
                    </div>
                </div>
                <Divider.Line color="dark" />
                <div className="w-full flex gap-4 flex-col items-center md:justify-between md:flex-row">
                    <span className="text-baltic-sea-600 text-[13px] font-normal tracking-[0.26px] font-sans order-2 md:order-2">
                        {LABELS.FOOTER.COPYRIGHT}
                    </span>
                    <AppLink
                        href={LINKS.WEBSITE_FEEDBACK}
                        className="order-1 md:order-2 py-2"
                        external
                    >
                        <Label.MenuItem className="flex gap-2 hover:text-classic-rose-500 duration-300">
                            {LABELS.FOOTER.FEEDBACK}
                            <Icons.ExternalLink size={20} />
                        </Label.MenuItem>
                    </AppLink>
                </div>
            </AppContainer>
        </div>
    )
}

AppFooter.displayName = "AppFooter"

export { AppFooter }
