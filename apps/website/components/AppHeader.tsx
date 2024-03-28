"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { classed } from "@tw-classed/react"
import { useState } from "react"
import { Icons } from "./elements/Icons"
import { LINKS, MENU_ITEMS, SOCIAL_LINKS } from "@/common/settings"
import { Button } from "./elements/Button"
import { Label } from "./elements/Label"
import { LABELS } from "@/content/pages/label"
import { Divider } from "./elements/Divider"
import { AppContainer } from "./AppContainer"

const LinkItem = classed.div(
    "relative flex items-center gap-2 text-base font-dm-sans duration-300 p-2",
    {
        variants: {
            active: {
                true: "text-classic-rose-500 font-semibold",
                false: "text-baltic-sea-50 font-medium"
            }
        },
        defaultVariants: {
            active: false
        }
    }
)

function MobileNav() {
    const [isMobileNavOpen, setMobileNavOpen] = useState(false)
    return (
        <div className="flex items-center lg:hidden">
            <button type="button" onClick={() => setMobileNavOpen(true)}>
                <Icons.burgher className="text-white" />
            </button>
            {isMobileNavOpen && (
                <div
                    aria-hidden="true"
                    onClick={() => setMobileNavOpen(false)}
                    className="z-5 fixed inset-0 flex justify-end bg-black opacity-50"
                />
            )}
            {isMobileNavOpen && (
                <div className="fixed gap-6 pt-6 px-4 overflow-hidden inset-y-0 right-0 z-10 flex w-full max-w-80 flex-col bg-baltic-sea-950 text-white">
                    <div className="flex justify-end h-10 items-center">
                        <button
                            type="button"
                            onClick={() => setMobileNavOpen(false)}
                        >
                            <Icons.close className="text-white" />
                        </button>
                    </div>
                    <div className="flex flex-col h-full">
                        <div className="flex w-full flex-col items-center gap-5 text-base font-medium">
                            <Button className="mx-auto">Launch App</Button>
                            {MENU_ITEMS.map(
                                (
                                    {
                                        footerOnly,
                                        label,
                                        href,
                                        external,
                                        showInMobile
                                    },
                                    index
                                ) => {
                                    if (footerOnly && !showInMobile) return null

                                    return (
                                        <Link
                                            key={index}
                                            href={href}
                                            onClick={() =>
                                                setMobileNavOpen(false)
                                            }
                                            className="flex items-center gap-0.5 p-2"
                                        >
                                            {label}
                                            {external && (
                                                <Icons.externalLink
                                                    className="text-white"
                                                    size={20}
                                                />
                                            )}
                                        </Link>
                                    )
                                }
                            )}
                            <div className="flex items-center flex-wrap gap-4">
                                {SOCIAL_LINKS.map(
                                    ({ label, href, icon }, index) => {
                                        const Icon: any = icon
                                        return (
                                            <Link key={index} href={href}>
                                                <Label.MenuItem
                                                    key={index}
                                                    className="flex items-center"
                                                >
                                                    <Icon />
                                                    <span>{label}</span>
                                                </Label.MenuItem>
                                            </Link>
                                        )
                                    }
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-12 mt-auto overflow-hidden">
                            <Divider.Line className="mx-auto" />
                            <div className="flex flex-col gap-4 mx-auto text-center mb-8">
                                <Link
                                    href={LINKS.WEBSITE_FEEDBACK}
                                    target="_blank"
                                >
                                    <Label.MenuItem className="flex items-center">
                                        {LABELS.FOOTER.FEEDBACK}
                                        <Icons.externalLink />
                                    </Label.MenuItem>
                                </Link>
                                <span className="text-baltic-sea-600 text-[13px] font-normal tracking-[0.26px] font-sans">
                                    {LABELS.FOOTER.COPYRIGHT}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function DesktopNav() {
    const pathname = usePathname()
    return (
        <>
            <ul className="hidden lg:flex gap-1">
                {MENU_ITEMS.map(
                    ({ label, href, footerOnly, external }, index) => {
                        if (footerOnly) return null // this is a footer only item

                        const pathParts = href.split("/").filter(Boolean)
                        const isHome = pathname === "/" && href === "/"

                        // is home or the first part of the path matches the first part of the href
                        const isActive =
                            isHome ||
                            (pathname !== null &&
                                pathParts[0] === pathname.split("/")[1])

                        return (
                            <LinkItem key={index} active={isActive}>
                                <div className="flex items-center gap-1">
                                    <div className="w-4 block">
                                        {isActive && <Icons.bird />}
                                    </div>
                                    <Link href={href}>{label}</Link>
                                </div>
                                {external && <Icons.externalLink />}
                            </LinkItem>
                        )
                    }
                )}
            </ul>
            <Button className="hidden lg:flex">Launch App</Button>
        </>
    )
}

function Logo() {
    return (
        <>
            <Image
                className="block md:hidden"
                src="/icons/bandada-logo-small.svg"
                height={44}
                width={38}
                alt="bandada logo small"
            />
            <Image
                className="hidden md:block"
                src="/icons/bandada-logo.svg"
                height={44}
                width={213}
                alt="bandada logo"
            />
        </>
    )
}

function AppHeader() {
    return (
        <div className="bg-baltic-sea-950 sticky top-0 z-50">
            <AppContainer className="flex items-center justify-between py-6">
                <Link className="h-[44px] w-[38px] md:w-[232px]" href="/">
                    <Logo />
                </Link>
                <DesktopNav />
                <MobileNav />
            </AppContainer>
        </div>
    )
}

AppHeader.displayName = "AppHeader"

export { AppHeader }
