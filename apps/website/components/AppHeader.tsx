"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { classed } from "@tw-classed/react"
import { useEffect, useState } from "react"
import { Icons } from "./elements/Icons"
import { LINKS, MENU_ITEMS, SOCIAL_LINKS } from "@/common/settings"
import { Button } from "./elements/Button"
import { Label } from "./elements/Label"
import { Divider } from "./elements/Divider"
import { AppContainer } from "./AppContainer"
import { LABELS } from "@/shared/labels"
import useSettings from "@/hooks/useSettings"

const LinkItem = classed.div(
    "relative flex items-center text-base font-dm-sans duration-300 tracking-[0.16px]",
    {
        variants: {
            active: {
                true: "text-classic-rose-500 font-semibold py-2 pr-2",
                false: "text-baltic-sea-50 hover:text-classic-rose-500 font-medium p-2"
            }
        },
        defaultVariants: {
            active: false
        }
    }
)

function MobileNav() {
    const [isMobileNavOpen, setMobileNavOpen] = useState(false)
    const { clientHeight } = useSettings()

    // prevent scrolling of body element when mobile nav is open
    useEffect(() => {
        if (!isMobileNavOpen) {
            document.body.style.overflow = "auto"
            document.body.style.height = "auto"
        } else {
            document.body.style.overflow = "hidden"
            document.body.style.height = `${clientHeight}px`
        }
    }, [clientHeight, isMobileNavOpen])

    return (
        <div className="flex items-center lg:hidden">
            <button
                type="button"
                aria-label="burgher menu"
                onClick={() => {
                    setMobileNavOpen(true)
                }}
            >
                <Icons.burgher className="text-white" />
            </button>
            {isMobileNavOpen && (
                <div
                    aria-hidden="true"
                    aria-label="mobile nav overlay"
                    onClick={() => setMobileNavOpen(false)}
                    className="z-5 fixed inset-0 flex justify-end bg-black opacity-50"
                />
            )}
            {isMobileNavOpen && (
                <div className="fixed gap-4 pt-4 px-4 sm:gap-6 sm:pt-6 overflow-hidden inset-y-0 right-0 z-10 flex w-full max-w-[440px] flex-col bg-baltic-sea-950 text-white">
                    <div className="flex justify-end h-10 items-center">
                        <button
                            type="button"
                            aria-label="close mobile nav"
                            onClick={() => setMobileNavOpen(false)}
                        >
                            <Icons.close className="text-white" />
                        </button>
                    </div>
                    <div className="flex flex-col h-full">
                        <div className="flex w-full flex-col items-center gap-4 sm:gap-5 text-base font-medium">
                            <Link href={LINKS.LAUNCH_APP} target="_blank">
                                <Button className="mx-auto">
                                    {LABELS.COMMON.LAUNCH_APP}
                                </Button>
                            </Link>
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
                                                <Icons.ExternalLink
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
                        <div className="flex flex-col gap-4 md:gap-12 mt-auto overflow-hidden">
                            <Divider.Line className="mx-auto" />
                            <div className="flex flex-col gap-2 sm:gap-4 mx-auto text-center mb-8">
                                <Link
                                    href={LINKS.WEBSITE_FEEDBACK}
                                    target="_blank"
                                >
                                    <Label.MenuItem className="flex items-center">
                                        {LABELS.FOOTER.FEEDBACK}
                                        <Icons.ExternalLink />
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
            <ul className="hidden lg:flex gap-6">
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
                            <div
                                key={index}
                                className="flex items-center group"
                            >
                                <LinkItem key={index} active={isActive}>
                                    <div className="flex items-center gap-[6px]">
                                        {isActive && (
                                            <Icons.Bird className="w-4 block" />
                                        )}
                                        <Link href={href}>{label}</Link>
                                    </div>
                                </LinkItem>
                                {external && (
                                    <Icons.ExternalLink className="duration-300 text-white group-hover:text-classic-rose-500" />
                                )}
                            </div>
                        )
                    }
                )}
            </ul>

            <Link
                href={LINKS.LAUNCH_APP}
                className="hidden lg:flex"
                target="_blank"
            >
                <Button>{LABELS.COMMON.LAUNCH_APP}</Button>
            </Link>
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
